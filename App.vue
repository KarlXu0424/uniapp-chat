<script>
	import Vue from 'vue'
	import IndexedDB from 'static/js/indexedDB.js'

	export default {
		created() {
			// #ifdef APP-PLUS
			plus.navigator.closeSplashscreen();
			// #endif 

			uni.connectSocket({
				url: 'ws://127.0.0.1:8080'
			});
			uni.onSocketOpen(function(res) {
				console.log('WebSocket连接已打开');
			});
			uni.onSocketError(function(res) {
				console.log('WebSocket连接打开失败');
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: 'WebSocket连接打开失败'
				});
			});
			uni.onSocketMessage(function(res) {
				// getApp().getMessage(res.data);
			});
		},
		onLaunch: function() {

			// console.log('App Launch')
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
		},
		onShow: function() {
			// console.log('App 开启')
		},
		onHide: function() {
			// console.log('App 关闭')
		},
		methods: {
			isLogin() {
				// 判断缓存中是否登录过
				try {
					const value = localStorage.getItem('is_login');
					return value;
				} catch (e) {
					// error
				}
			},
			checkLogin() {
				let is_login = this.isLogin();
				if (!is_login) {
					this.$router.push({
						path: '/'
					});
				}
			},
			sendSocketMessage(msg) {
				console.log(msg)
				uni.sendSocketMessage({
					data: msg
				});
			},
			getMessage(msg) {
				console.log(msg);
				let data = JSON.parse(msg);
				let user_id = localStorage.getItem('user_id');
				if (data.code !== 1000) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: data.message
					});
				}
				switch (data.type) {
					case "ping":
						break;
					case "send":
						if (data.send_type === 'friend') {
							let table = null;
							// 自己发送的消息
							if (data.from_user_id == user_id) {
								table = data.from_user_id;
								this.db.open({
									name: data.from_user_id,
									options: {
										autoIncrement: true,
										keyPath: 'id'
									},
								});

							} else { // 好友发送的消息
								table = data.to_friend_user_id;
								this.db.open({
									name: data.to_friend_user_id,
									options: {
										autoIncrement: true,
										keyPath: 'id'
									},
								});
							}
							this.db.add({
								name: data.from_user_name,
								user_id: data.from_user_id,
								friend_id: data.to_friend_user_id,
								content: data.content,
								time: data.time,
							}, table);
							console.log(1111111111111111);
							console.log(table);
						}
						break;
				}
			}
		}
	}
</script>

<style>
	@import './common/uni.css';

	body {
		background: #FFFFFF !important;
	}
</style>
