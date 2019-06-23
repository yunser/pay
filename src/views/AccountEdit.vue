<template>
    <my-page title="新增编辑" :page="page" backable>
        <div class="common-container container">
            <ui-text-field v-model="account.title" label="标题" />
            <br>
            <ui-text-field v-model="account.account" label="账号" />
            <br>
            <ui-select-field v-model="account.type" label="加密类型">
                <ui-menu-item value="" title="无"/>
                <ui-menu-item value="3DES" title="3DES"/>
            </ui-select-field>
            <br>
            <ui-text-field v-model="account.password" label="密码" />
            <br>
            <ui-text-field v-model="account.url" label="网址" />
            <br>
            <ui-text-field v-model="account.tags" label="标签" />
            <br>
            <ui-text-field v-model="account.note" label="备注" multiLine :rows="3" :rowsMax="6" />
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    const CryptoJS = window.CryptoJS

    export default {
        data () {
            return {
                key: '',
                account: {
                    title: '',
                    account: '',
                    type: '12',
                    password: '',
                    url: '',
                    tags: '',
                    note: ''
                },
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'check',
                            click: this.finish,
                            title: '刷新'
                        },
                    ]
                }
            }
        },
        mounted() {
            this.init()
        },
        filters: {
        },
        methods: {
            init() {
                this.accountId = this.$route.params.id
                this.account.type = '3DES'
                this.key = this.$storage.get('key', '')

                let en =  CryptoJS.TripleDES.encrypt('123456', this.key).toString()
                console.log('en', en)
                let de = CryptoJS.TripleDES.decrypt(en, this.key).toString(CryptoJS.enc.Utf8)
                console.log('测试')
                console.log('de', de)

                this.loadData()
            },
            loadData() {
                if (!this.accountId) {
                    return
                }
                this.$http.get(`/password/accounts/${this.accountId}`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.account = data
                        if (this.account.type === '3DES') {
                            this.account.password = CryptoJS.TripleDES.decrypt(this.account.password, this.key).toString(CryptoJS.enc.Utf8)
                        }
                    },
                    response => {
                        console.log(response)
                    })
            },
            finish() {
                if (this.accountId) {
                    // 修改
                    let {password} = this.account
                    console.log(this.account.type === '3DES')
                    
                    if (this.account.type === '3DES') {
                        password = CryptoJS.TripleDES.encrypt(password, this.key).toString()
                    }
                    console.log({
                        ...this.account,
                        password
                    })
                    this.$http.put(`/password/accounts/${this.accountId}`, {
                        ...this.account,
                        password
                    }).then(
                        response => {
                            let data = response.data
                            console.log(data)
                            this.$router.go(-1)
                        },
                        response => {
                            console.log(response)
                        })
                } else {
                    // 新增
                    let {password} = this.account
                    if (this.account.type === '3DES') {
                        console.log('3DES')
                        password = CryptoJS.TripleDES.encrypt(password, this.key).toString()
                    }
                    // console.log({
                    //     ...this.account,
                    //     password
                    // })
                    // return
                    this.$http.post(`/password/users/1/accounts`, {
                        ...this.account,
                        password
                    }).then(
                        response => {
                            let data = response.data
                            console.log(data)
                            this.$router.go(-1)
                        },
                        response => {
                            console.log(response)
                        })
                }
            },
            refresh() {
                this.loadData()
            },
            decrypt(text) {
                return CryptoJS.TripleDES.decrypt(text, this.key || '').toString(CryptoJS.enc.Utf8)
            }
        }
    }
</script>

<style lang="scss" scoped>
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
</style>
