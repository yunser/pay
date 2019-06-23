<template>
    <my-page title="我的密码" :page="page">
        
        <!-- <p v-if="$store.state.user">
                <router-link to="/manage">进入管理界面</router-link>
            </p> -->
        <a class="btn-link login-btn" href="javascript:;" v-if="!$store.state.user" @click="login">点击登陆</a>
        <div class="common-container container" v-if="$store.state.user">
            <div class="mask" v-if="maskVisible">
                <div class="mark-content">
                    <ui-text-field v-model="key" type="password" hintText="请输入主密码" />
                    <button @click="save">进入</button>
                </div>
            </div>
            <div class="else">
                <div class="empty" v-if="!accounts.length">您还没有添加账号</div>
                <div v-else>
                    <div class="search-box">
                        <input class="input" v-model="keyword" placeholder="输入标题/网址/备注搜索" @keydown="keyDown($event)">
                        <ui-icon-button icon="close" title="搜索" primary @click="clearKeyword" v-if="keyword" />
                        <ui-icon-button icon="search" title="搜索" primary @click="search" />
                    </div>
                    <!-- <button @click="clearKey">清除秘钥</button>
                    <br> -->
                    <ul class="account-list">
                        <li class="item" v-for="account, index in filterAccounts">
                            <div class="title">
                                <router-link :to="`/accounts/${account.id}`">{{ account.title || '无标题' }}</router-link>
                            </div>
                            <div> 
                                账号：
                                <span v-if="!account.account">无</span>
                                <span class="btn-copy" :data-clipboard-text="account.account" v-if="account.account">{{ account.account }}</span>
                            </div>
                            <div class="password-box" v-if="account.password">
                                密码：
                                <span class="btn-copy" :data-clipboard-text="decrypt(account.password)">******</span>
                                <!-- <div class="password2" v-if="account.type === ''">{{ account.password }}</div> -->
                                <!-- <div class="password2" v-if="account.type !== ''">{{ key ? decrypt(account.password) : '请输入密钥'}}</div> -->
                                <!-- <a class="item-btn btn-copy" href="javascript:;" :data-clipboard-text="decrypt(account.password)">复制</a> -->
                            </div>
                            <a class="url" :href="account.url" v-if="account.url">访问</a>
                        </li>
                    </ul>
                    <ui-raised-button label="下一页" @click="nextPage" v-if="!loadFinish" />
                    <!-- <div v-if="loadFinish">-已经记载完了-</div> -->
                </div>

                <ui-float-button class="float-button" icon="add" secondary @click="add" />
            </div>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    const CryptoJS = window.CryptoJS
    const Clipboard = window.Clipboard
    import oss from '@/util/oss'
    
    export default {
        data () {
            return {
                curPage: 1,
                key: '',
                keyword: '',
                accounts: [],
                maskVisible: true,
                loadFinish: false,
                page: {
                    menu: [
                        // {
                        //     type: 'icon',
                        //     icon: 'search',
                        //     click: this.search,
                        //     title: '搜索'
                        // },
                        {
                            type: 'icon',
                            icon: 'lock',
                            click: this.lock,
                            title: '锁定'
                        },
                        {
                            type: 'icon',
                            icon: 'refresh',
                            click: this.refresh,
                            title: '刷新'
                        },
                        // {
                        //     type: 'icon',
                        //     icon: 'add',
                        //     click: this.add,
                        //     title: '应用'
                        // }
                    ]
                }
            }
        },
        computed: {
            filterAccounts() {
                return this.accounts
                // if (this.keyword) {
                //     return this.accounts.filter(item => {
                //         return item.title.includes(this.keyword) || item.account.includes(this.keyword) ||
                //             item.note.includes(this.keyword) || item.tags.includes(this.keyword)
                //     })
                // }
                // return this.accounts
            }
        },
        mounted() {
            let { host } = this.$route.query
            if (host) {
                this.$router.push(`/manage?keyword=${encodeURIComponent(host)}`)
                return
            }

            this.init()

            this.clipboard = new Clipboard('.btn-copy')
            this.clipboard.on('success', e => {
                console.info('Action:', e.action)
                console.info('Text:', e.text)
                console.info('Trigger:', e.trigger)
                e.clearSelection()
                this.$message({
                    type: 'success',
                    text: '已复制'
                })
            })
            this.clipboard.on('error', function (e) {
                console.error('Action:', e.action)
                console.error('Trigger:', e.trigger)
            })
        },
        filters: {
        },
        methods: {
            nextPage() {
                this.curPage++
                this.loadData()
            },
            keyDown(e) {
                console.log(e.keyCode)
                if (e.keyCode === 13) {
                    this.search()
                }
            },
            init() {
                if (!this.$store.state.user) {
                    return
                }
                this.key = this.$storage.get('key', '')
                console.log('this.key', this.key)
                this.maskVisible = !this.key
                // if (this.key) {
                //     this
                // }
                this.loadData()
            },
            loadData() {
                let { keyword } = this.$route.query
                // this.userId = this.$route.params.id
                this.keyword = keyword
                this.$http.get(`/password/accounts?page=${this.curPage}&page_size=20&keyword=${keyword ? encodeURIComponent(keyword) : ''}`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        if (this.curPage !== 1 && !data.length) {
                            // this.pageVisible = false
                            this.$message({
                                type: 'danger',
                                text: '没有数据了'
                            })
                            this.loadFinish = true
                            // return
                        }
                        if (this.curPage === 1) {
                            this.accounts = data
                        } else {
                            this.accounts = this.accounts.concat(data)
                        }
                        this.loadFinish = this.accounts.length == response.headers['x-total']
                    },
                    response => {
                        console.log(response)
                    })
            },
            add() {
                this.$router.push('/add')
            },
            refresh() {
                this.loadData()
            },
            decrypt(text) {
                return CryptoJS.TripleDES.decrypt(text, this.key || '').toString(CryptoJS.enc.Utf8)
            },
            save() {
                if (!this.key) {
                    this.$message({
                        type: 'danger',
                        text: '请输入主密码'
                    })
                    return
                }
                this.$storage.set('key', this.key)
                this.maskVisible = false
            },
            lock() {
                this.clearKey()
                this.maskVisible = true
            },
            clearKey() {
                this.key = ''
                this.$storage.set('key', '')
            },
            clearKeyword() {
                this.keyword = ''
                this.$router.push('/manage')
            },
            search() {
                if (!this.keyword) {
                    this.$message({
                        type: 'danger',
                        text: '请输入关键词'
                    })
                    return
                }
                this.$router.push(`/manage?keyword=${encodeURIComponent(this.keyword)}`)
            },
            login() {
                location.href = oss.getOauthUrl()
            }
        }
    }
</script>

<style lang="scss" scoped>
.login-btn {
    display: block;
    padding: 160px 0;
    text-align: center;
}
.empty {
    padding: 160px 0;
    text-align: center;
    color: #999;
}
.container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}
.mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    background-color: #fff;
    .mark-content {
        width: 100px;
        height: 100px;
    }
}
.account-list {
    .item {
        position: relative;
        margin-bottom: 16px;
        padding: 16px;
        // border: 1px solid #000;
        box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
    }
    .title {
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: bold;
    }
    .btn-copy {
        // color: #f00;
        cursor: pointer;
    }
    .url {
        position: absolute;
        top: 16px;
        right: 16px;
        color: #ff4081;
    }
}
.column-title {
    width: 240px;
}
.column-account {
    width: 240px;
}
.column-password {
    width: 240px;
}
.password-box {
    &:hover {
        .password {
            display: block;
        }
    }
    .password {
        display: none;
    }
}
.search-box {
    display: flex;
    width: 100%;
    max-width: 100%;
    margin-bottom: 24px;
    // border: 1px solid #eee;
    box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
    background-color: #fff;
    &:hover {
        box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
    }
    .input {
        flex-grow: 1;
        display: block;
        height: 48px;
        padding: 0 16px;
        line-height: 48px;
        border: none;
        outline: none;
    }
}
</style>
