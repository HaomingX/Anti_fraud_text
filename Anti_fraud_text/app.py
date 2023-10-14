from flask import Flask, render_template, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from model.TextCNN import Model as textCNN
from utils import build_dataset, build_iterator, get_time_dif
from model.FastText import Model as Fasttext
from utils_fasttext import build_dataset, build_iterator, get_time_dif
from train_eval import train, init_network
from importlib import import_module
import torch
import numpy as np
import pickle as pkl
import time
import re
import openai
import json
import collections
import random
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.int_, np.intc, np.intp, np.int8,
            np.int16, np.int32, np.int64, np.uint8,
            np.uint16,np.uint32, np.uint64)):
            return int(obj)
        elif isinstance(obj, (np.float_, np.float16, np.float32, 
            np.float64)):
            return float(obj)
        elif isinstance(obj, (np.ndarray,)): # add this line
            return obj.tolist() # add this line
        return json.JSONEncoder.default(self, obj)   
app = Flask(__name__)
# openai.api_key = "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"
openai.api_key = "sk-f2X2TELItRbY8qqGWEIAPUjirxea1CEIBuBDvjK5auwToAs0"
openai.api_base = "https://api.f2gpt.com/v1"
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456@localhost:3306/data'
db = SQLAlchemy(app) # db为对象名，自拟
class Antiscam(db.Model):
	# 定义表名
	__tablename__ = 'like_table'
	# 定义字段
	completion = db.Column(db.Integer, nullable=False)
	prompt = db.Column(db.String(10000), nullable=False, primary_key=True)
	classes = db.Column(db.String(30), nullable=False)
	like = db.Column(db.String(10), nullable=False)
	def __init__(self, completion, prompt, classes,like):
		self.completion = completion
		self.prompt = prompt   
		self.classes = classes
		self.like = like               
@app.route('/', methods=['GET', 'POST'])
def home():
	return render_template('index.html')

@app.route('/index', methods=['GET', 'POST'])
def index():
	return render_template('index.html')

@app.route('/like', methods=['GET', 'POST'])
def like():
	if request.method == 'POST':
		message = request.form['message']
		result = request.form['result']
		prompt = request.form['prompt']
		like = request.form['like']
		try:
			new_antiscam = Antiscam(completion=prompt, prompt=message, classes=result,like=like)
			db.session.add(new_antiscam)
			db.session.commit()
			return 'User added successfully'
		except Exception as e:
			return f'Error: {str(e)}'
	#return render_template('index.html')

@app.route('/predict', methods=['POST', 'GET'])
def predict():
	dataset = 'antiscam'  # 数据集
	embedding = 'embedding_8.npz'
	embedding_y = 'random'
	x = import_module('model.TextCNN')
	y = import_module('model.FastText')
	textrnn= import_module('model.TextRNN')
	bert = import_module('model.bert')
	ernie = import_module('model.ERNIE')
	config_x = x.Config(dataset, embedding)
	config_y = y.Config(dataset, embedding_y)
	config_textrnn = textrnn.Config(dataset, embedding)
	config_bert = bert.Config(dataset)
	config_ernie = ernie.Config(dataset)
	print(f'len(class)={len(config_ernie.class_list)}')
	print(config_x.device,config_y.device)
	config_y.n_vocab = 5283
	UNK, PAD = '<UNK>', '<PAD>'  # 未知字，padding符号
	pad_size_x = config_x.pad_size
	pad_size_y = config_y.pad_size
	pad_size_att = config_textrnn.pad_size
	pad_size_bert = config_bert.pad_size
	pad_size_ernie = config_ernie.pad_size
	print(config_y.n_vocab,config_y.pad_size)
	model1 = x.Model(config_x).to('cpu')  # TextCNN模型
	model1.load_state_dict(torch.load('antiscam/saved_dict/TextCNN_8_1.ckpt'))
	model2 = y.Model(config_y).to('cpu')  # FastText模型
	model2.load_state_dict(torch.load('antiscam/saved_dict/FastText_8_1.ckpt'))
	model3 = textrnn.Model(config_textrnn).to('cpu')
	model3.load_state_dict(torch.load('antiscam/saved_dict/TextRNN_8_1.ckpt'))
	model4 = bert.Model(config_bert).to('cpu')
	model4.load_state_dict(torch.load('antiscam/saved_dict/bert8.ckpt'))
	model5 = ernie.Model(config_ernie).to('cpu')
	model5.load_state_dict(torch.load('antiscam/saved_dict/ERNIE8.ckpt'))
	model1.eval()
	model2.eval()
	model3.eval()
	model4.eval()
	model5.eval()

	if request.method == 'POST':
		message = request.form['message']
		usemodel = request.form['model']
		message_copy = message
		
		message = message.replace("年", "-").replace("月", "-").replace("日", "-").replace("时", "-").replace("分", " ").strip()
		message = re.sub("\s+", "", message)
		# 2022年6月14日18时01分许 "2022年6月7日" "2014年5月"
		# [^\u4e00-\u9fa5]  除去字符
		regex_list = [r"(\d{4}-\d{1,2}-\d{1,2}-\d{1,2}-\d{1,2})|(\d{4}-\d{1,2}-\d{1,2})|(\d{4}-\d{1,2})",
					r"[_.!+-=——,$%^，：“”（）:。？、~@#￥%……&*《》<>「」{}【】()/]",
					]
		for regex in regex_list:
			pattern = re.compile(regex)
			message = re.sub(pattern,'',message)
			
		# tokenizer = lambda x: x.split(' ') # 分字
		vocab = pkl.load(open('antiscam/data/vocab_8.pkl', 'rb'))
		token = list(message)
		token_c = token.copy()
		seq_len = len(token)
		predictions = {
			'FastText': None,
            'TextCNN': None,
            'TextRNN': None,
            'bert': None,
			'ERNIE':None
            # 'GPT_FT': None
        }
		if usemodel == 'FastText' or usemodel == 'Ensemble':
			if pad_size_y:
				if len(token_c) < pad_size_y:
					token_c.extend([PAD] * (pad_size_y - len(token_c)))
				else:
					token_c = token_c[:pad_size_y]
			seq_len = pad_size_y
			print(seq_len,len(token_c),token_c)
			words_c = []
			for word in token_c:
				words_c.append(vocab.get(word, vocab.get(UNK)))
			print(words_c)
			def biGramHash(sequence, t, buckets):
				t1 = sequence[t - 1] if t - 1 >= 0 else 0	
				return (t1 * 14918087) % buckets

			def triGramHash(sequence, t, buckets):
				t1 = sequence[t - 1] if t - 1 >= 0 else 0
				t2 = sequence[t - 2] if t - 2 >= 0 else 0
				return (t2 * 14918087 * 18408749 + t1 * 14918087) % buckets
			
			buckets = config_y.n_gram_vocab
			bigram = []
			trigram = []
			# ------ngram------
			for i in range(pad_size_y):
				bigram.append(biGramHash(words_c, i, buckets))
				trigram.append(triGramHash(words_c, i, buckets))
			bigram = torch.LongTensor(bigram).unsqueeze(0)
			trigram = torch.LongTensor(trigram).unsqueeze(0)
			# print(bigram,trigram)
			sentence2 = np.array([int(x) for x in words_c[0:pad_size_y]])
			sentence2 = torch.from_numpy(sentence2)
			sentence2 = (sentence2.unsqueeze(0).type(torch.LongTensor),seq_len,bigram,trigram)
			print(sentence2)
			predict2 = model2(sentence2).detach().numpy()[0] #.cpu().detach().numpy()[0]
			print(predict2)
			score2 = max(predict2)
			label2 = np.where(predict2 == score2)[0][0]
			if usemodel == 'FastText' :
				return json.dumps({"prediction" : label2,"message" : message_copy},cls=NpEncoder)
			if usemodel == 'Ensemble':
				predictions['FastText'] = predict2  # 将TextCNN的预测结果存储在字典中
				print(predict2)
		if usemodel == 'TextCNN' or usemodel == 'Ensemble':
			token = list(message)
			token_c = token.copy()
			seq_len = len(token)
			if pad_size_x:
				if seq_len < pad_size_x:
					token.extend([PAD] * (pad_size_x - seq_len))
				else:
					token = token[:pad_size_x]
					seq_len = pad_size_x
				words = []
				for word in token:
					words.append(vocab.get(word, vocab.get(UNK)))
				# print([[int(x) for x in words[0:pad_size]]])
				sentence1 = np.array([int(x) for x in words[0:pad_size_x]])
				sentence1 = torch.from_numpy(sentence1)
				sentence1 = (sentence1.unsqueeze(0).type(torch.LongTensor),seq_len)

				predict1 = model1(sentence1).detach().numpy()[0]
				# 获取最大概率值及其索引
				max_score = max(predict1)
				max_score_index = np.where(predict1 == max_score)[0]
				
				# 设置阈值
				threshold = 0.5
				# 找到接近最大概率值的索引
				close_indices = np.where(predict1 >= max_score - 0.1)[0]

				# 如果最大概率值及接近的概率值都小于阈值，判定为其他类型
				if max_score < threshold and all(predict1[close_indices] < threshold):
					predicted_labels = [8]
				else:
					# 获取分类结果及对应的概率值
					if max_score_index in close_indices:
						predicted_labels = [max_score_index] + [label for label in close_indices if label != max_score_index]
					else:
						predicted_labels = [label for label in close_indices]
					# 输出预测结果及对应的概率值
					for label in predicted_labels:
						print(f"预测结果：{label}，概率值：{predict1[label]}")
				# predict1 = model1(sentence1).detach().numpy()[0] #.cpu().detach().numpy()[0]
				# # print(predict1)
				# score1 = max(predict1)
				# label1 = np.where(predict1 == score1)[0][0]
			if usemodel == 'TextCNN' :
				return json.dumps({"prediction" : predicted_labels,"message" : message_copy},cls=NpEncoder)
			else:
				predictions['TextCNN'] = predict1
				#tuple(label)  # 将TextCNN的预测结果存储在字典中
		if usemodel == 'TextRNN' or usemodel == 'Ensemble':
			if pad_size_att:
				if len(token) < pad_size_att:
					token.extend([PAD] * (pad_size_att - len(token)))
				else:
					token = token[:pad_size_att]
					seq_len = pad_size_att
				words = []
				for word in token:
					words.append(vocab.get(word, vocab.get(UNK)))
				# print([[int(x) for x in words[0:pad_size]]])
				sentence3 = np.array([int(x) for x in words[0:pad_size_att]])
				sentence3 = torch.from_numpy(sentence3)
				sentence3 = (sentence3.unsqueeze(0).type(torch.LongTensor),seq_len)
				predict3 = model3(sentence3).detach().numpy()[0] #.cpu().detach().numpy()[0]
				# print(predict1)
				score3= max(predict3)
				label3 = np.where(predict3 == score3)[0][0]
			if usemodel == 'TextRNN' :
				return json.dumps({"prediction" : [label3] ,"message" : message_copy},cls=NpEncoder)
			else:
				predictions['TextRNN'] = predict3# 将TextRNN_Att的预测结果存储在字典中
				print(predictions)
        
		if usemodel == 'bert' or usemodel == 'Ensemble':
			PAD, CLS = '[PAD]', '[CLS]'  # padding符号, bert中综合信息符号
			token = config_bert.tokenizer.tokenize(message)
			token = [CLS] + token
			seq_len = len(token)
			mask = []
			token_ids = config_bert.tokenizer.convert_tokens_to_ids(token)
			if pad_size_bert:
				if len(token) < pad_size_bert:
					mask = [1] * len(token_ids) + [0] * (pad_size_bert - len(token))
					token_ids += ([0] * (pad_size_bert - len(token)))
				else:
					mask = [1] * pad_size_bert
					token_ids = token_ids[:pad_size_bert]
					seq_len = pad_size_bert
			sentence4 = np.array([int(x) for x in token_ids[0:pad_size_x]])
			mask = np.array([int(x) for x in mask[0:pad_size_x]])
			sentence4 = torch.from_numpy(sentence4)
			mask = torch.from_numpy(mask)
			sentence4 = (sentence4.unsqueeze(0).type(torch.LongTensor), seq_len, mask.unsqueeze(0).type(torch.LongTensor))
			predict4 = model4(sentence4).detach().numpy()[0] #.cpu().detach().numpy()[0]
			score4 = max(predict4)
			label4 = np.where(predict4 == score4)[0][0]
			print(f'label4: {label4}')
			if usemodel == 'bert':
				return json.dumps({"prediction" : [label4],"message" : message_copy},cls=NpEncoder)
			else:
				predictions['bert'] = predict4  # 将BERT的预测结果存储在字典中
				print(predictions)
		if  usemodel == 'ERNIE' or usemodel == 'Ensemble':
			PAD, CLS = '[PAD]', '[CLS]'  # padding符号, bert中综合信息符号
			token = config_ernie.tokenizer.tokenize(message)
			token = [CLS] + token
			seq_len = len(token)
			mask = []
			token_ids = config_ernie.tokenizer.convert_tokens_to_ids(token)
			if pad_size_ernie:
				if len(token) < pad_size_ernie:
					mask = [1] * len(token_ids) + [0] * (pad_size_ernie - len(token))
					token_ids += ([0] * (pad_size_ernie - len(token)))
				else:
					mask = [1] * pad_size_ernie
					token_ids = token_ids[:pad_size_ernie]
					seq_len = pad_size_ernie
			sentence4 = np.array([int(x) for x in token_ids[0:pad_size_x]])
			mask = np.array([int(x) for x in mask[0:pad_size_x]])
			sentence4 = torch.from_numpy(sentence4)
			mask = torch.from_numpy(mask)
			sentence4 = (sentence4.unsqueeze(0).type(torch.LongTensor), seq_len, mask.unsqueeze(0).type(torch.LongTensor))
			predict4 = model5(sentence4).detach().numpy()[0] #.cpu().detach().numpy()[0]
			score4 = max(predict4)
			label4 = np.where(predict4 == score4)[0][0]
			print(f'label4: {label4}')
			if usemodel == 'ERNIE':
				return json.dumps({"prediction" : [label4],"message" : message_copy},cls=NpEncoder)
			else:
				predictions['ERNIE'] = predict4  # 将BERT的预测结果存储在字典中
				print(predictions)
		if usemodel == 'ChatGPT':
			message = request.form['message']
			message_copy = message
			result = 0
			response = openai.ChatCompletion.create(
					model="gpt-3.5-turbo",
					messages =[
						{"role": "system", "content": "已知诈骗分为 冒充客服类，贷款、代办信用卡类，虚假网络投资理财类，冒充领导、熟人类，冒充公检法及政府机关类刷单返利类，虚假购物服务类，网络婚恋、交友类（非虚假网络投资理财类）共8种类别。判断以下文本是什么类型的诈骗并简单分析：请简洁的回答"},
						{"role": "user", "content": message_copy},
					])
			result = response.choices[0].message.content
			return json.dumps({"result" : result,"message" : message_copy,},cls=NpEncoder)
		if usemodel == 'GPT_FT' :
			message = request.form['message']
			message_copy = message
			print(1)
			category = ['冒充客服类','贷款、代办信用卡类','虚假网络投资理财类','冒充领导、熟人类','冒充公检法及政府机关类','刷单返利类','虚假购物服务类','网络婚恋、交友类（非虚假网络投资理财类）']
			ft_model = 'ada:ft-personal-2023-08-29-15-50-40'
			res = openai.Completion.create(model=ft_model, prompt=message + ' ->', max_tokens=1, temperature=0)
			result = category[int(res['choices'][0]['text'])]
			gpt_ft_mapping = {
				'冒充客服类': 0,
				'贷款、代办信用卡类': 1,
				'虚假网络投资理财类': 2,
				'冒充领导、熟人类': 3,
				'冒充公检法及政府机关类': 4,
				'刷单返利类': 5,
				'虚假购物服务类': 6,
				'网络婚恋、交友类（非虚假网络投资理财类）': 7
			}

			# 使用映射字典将GPT-FT的结果映射为编号
			if result in gpt_ft_mapping:
				gpt_ft_label = gpt_ft_mapping[result]
			if usemodel == 'GPT_FT':
				return json.dumps({"result" : result,"message" : message_copy,},cls=NpEncoder)
			if usemodel == 'Ensemble':
				predictions['GPT_FT'] = [gpt_ft_label]  # 将GPT-FT的预测结果存储在字典中
			
		if usemodel == 'Ensemble':
			
			result = np.sum(list(predictions.values()), axis=0)
			print(result)
			if result.size > 0:
				score4 = max(result)
				selected_prediction = np.where(result == score4)[0][0]
			else :
				selected_prediction = None
			# all_predictions = []
			# for key, value in predictions.items():
			# 	if isinstance(value, list):
			# 		all_predictions.extend(value)
			# 	else:
			# 		all_predictions.append(value)
			# count_dict = collections.Counter(all_predictions)
			# max_count = max(count_dict.values())
			# max_predictions = [prediction for prediction, count in count_dict.items() if count == max_count]
			# selected_prediction = random.choice(max_predictions)
			return json.dumps({"prediction": selected_prediction, "message": message_copy}, cls=NpEncoder)


@app.route('/charts', methods=['GET', 'POST'])
def charts():
	return render_template('charts.html')

@app.route('/start', methods=['GET', 'POST'])
def start():
	return render_template('start.html')
if __name__ == '__main__':
	app.run(debug=True)