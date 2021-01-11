<script>
	import Vue from 'vue'
	
	export default {
		created() {
			// #ifdef APP-PLUS
			plus.navigator.closeSplashscreen(); 
			// #endif 
		},
		onLaunch: function() {
			
			console.log('App Launch')
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
			console.log('App 开启')
		},
		onHide: function() {
			console.log('App 关闭')
		},
		methods:{
			isLogin: function() {
				// 判断缓存中是否登录过
				try {
					const value = uni.getStorageSync('is_login');
					return value;
				} catch (e) {
					// error
				}
			},
			checkLogin: function() {
				let is_login = this.isLogin();
				if (!is_login) {
					this.$router.push({path: '/'});
				}
			}
		}
	}
</script>

<style >
	@import './common/uni.css';
	body{
		background: #FFFFFF !important;
	}
	
</style>
