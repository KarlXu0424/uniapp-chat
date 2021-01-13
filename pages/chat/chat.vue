<template>
	<view>
		<view class="message pre-scrollable" style="height: 600px;overflow:auto;" id="message">
			<view style="overflow:hidden;" v-for="(message, index) in messages" :key="index">
				<view :class="message.user_id === user_id ? 'float-right' : ''">
					<view class="content">{{ message.name }} ： {{ message.content }}</view>
					<view class="time">
						<p>{{ message.time }}</p>
					</view>
				</view>
			</view>
		</view>
		<view class="viewider">
			<hr style="border-top:1px dashed #987cb9;" width="100%" color="#987cb9" size=1>
		</view>
		<view class="footer">
			<view class="input-group">
				<input type="text" class="form-control" v-model="sendMessage" placeholder="" @keydown.enter="sendForFriend()">
				<button type="submit" class="btn btn-primary" v-on:click="sendForFriend()">发送(Enter)</button>
			</view>
		</view>
	</view>
</template>

<script>
	import IndexedDB from 'static/js/indexedDB.js'
	export default {
		data() {
			return {
				postData: {},
				messages: [],
				sendMessage: null,
				friend_user_id: null,
				user_id: null,
				title: null,
			}
		},
		onLoad() {
			getApp().checkLogin();
			this.title = localStorage.getItem('chat_name');
			this.friend_user_id = localStorage.getItem('chat_id');
			this.user_id = localStorage.getItem('user_id');
			uni.setNavigationBarTitle({
				title: this.title
			})
			// this.getMessages();
		},
		methods: {
			sendForFriend: function() {
				let content = this.sendMessage;
				console.log(content);
				if (content == null) {
					return;
				}
				if (content.split(" ").join("").length === 0) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '不能发送空白信息'
					});
					this.sendMessage = null;
					return;
				}
				// 发送消息
				this.postData = {
					'token': localStorage.getItem('token'),
					'type': 'send',
					'send_type': 'friend',
					'friend_user_id': this.friend_user_id,
					'content': content,
				};
				getApp().sendSocketMessage(JSON.stringify(this.postData));
				this.db = new IndexedDB('chat', 1);
				this.db.open({
					name: 'test',
					options: {
						autoIncrement: true,
						keyPath: 'id'
					},
				});
				this.db.add({
					name: 'data.from_user_name',
					user_id: 'data.from_user_id',
					friend_id: 'data.to_friend_user_id',
					content: 'data.content',
					time: 'data.time',
				}, 'test');
				this.sendMessage = null;
			},
			getMessages: function() {
				let messages = getApp().globalData.messages;
				let chat_id = localStorage.getItem('chat_id');
				if (messages[chat_id] != null) {
					this.messages = messages[chat_id];
				} else {
					this.messages = [];
				}
			}
		}
	}
</script>

<style>
	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix {
		text-align: center;
	}
</style>
