<template>
    <my-page title="我的硬币" :page="page">
        <a class="btn-link login-btn" href="javascript:;" v-if="!$store.state.user" @click="login">点击登陆</a>
        <div class="common-container container" v-if="$store.state.user">
            <!-- <div class="title">账户余额</div> -->
            <div class="balance">
                <span class="number">{{ balance }}</span>
                个
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
                balance: '0.00',
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
                        // {
                        //     type: 'icon',
                        //     icon: 'lock',
                        //     click: this.lock,
                        //     title: '锁定'
                        // },
                        // {
                        //     type: 'icon',
                        //     icon: 'refresh',
                        //     click: this.refresh,
                        //     title: '刷新'
                        // },
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
            this.loadData()
        },
        methods: {
            loadData() {
                let { keyword } = this.$route.query
                // this.userId = this.$route.params.id
                this.keyword = keyword
                this.$http.get(`/pay/coin`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.balance = data.number
                    },
                    response => {
                        console.log(response)
                    })
            },
            login() {
                location.href = oss.getOauthUrl()
            }
        }
    }
</script>

<style lang="scss" scoped>
.title {
    color: #777;
}
.balance {
    padding-top: 160px;
    font-size: 24px;
    text-align: center;
    .number {
        font-size: 48px;
    }
}
</style>
