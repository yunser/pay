<template>
    <my-page title="密码管理" :page="page">
        <div class="common-container container">
            <p v-if="$store.state.user">
                <router-link to="/manage">进入管理界面</router-link>
            </p>
            <a href="javascript:;" v-if="!$store.state.user" @click="login">点击登陆</a>
        </div>
    </my-page>
</template>

<script>
    import oss from '@/util/oss'

    export default {
        data () {
            return {
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com?utm_source=password',
                            target: '_blank',
                            title: '应用'
                        }
                    ]
                }
            }
        },
        methods: {
            login() {
                location.href = oss.getOauthUrl()
            }
        }
    }
</script>

<style scoped>
</style>
