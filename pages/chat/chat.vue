<template>
	<view>
		<view class="message pre-scrollable" style="height: 600px;overflow:auto;" id="message">
			<view style="overflow:hidden;" v-for="message in messages" :key='index'>
				<view :class="message.user_id === uuid ? 'float-right' : ''" v-if="friend_user_id === message.user_id">
					<view class="content">{{ message.name }} ： {{ message.content }}</view>
					<view class="time">
						<p>{{ message.time }}</p>
					</view>
				</view>
				<view :class="message.user_id === uuid ? 'float-right' : ''" v-else-if="uuid === message.user_id && friend_user_id === message.friend_id">
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
	export default {
		data() {
			return {
				postData: {},
				messages: [],
				sendMessage: null,
				friend_user_id: null,
				title: null,
			}
		},
		onLoad() {
			getApp().checkLogin();
			this.title = localStorage.getItem('chat_name');
			this.friend_user_id = localStorage.getItem('chat_id');
			uni.setNavigationBarTitle({
				title: this.title
			})
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
				this.sendMessage = null;
			},
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
