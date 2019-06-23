<template>
    <my-page title="随机字符/密码生成" :page="page">
        <div class="common-container container">
            <div class="section">
                <div class="section-title">
                    <h3>选择包含的字符</h3>
                </div>
                <div class="section-body">
                    <ul class="char-list">
                        <li class="item" v-for="char in charList">
                            <ui-checkbox class="checkbox" name="group" 
                                :nativeValue="char.char" v-model="list" :label="char.title" :title="char.desc"/>
                        </li>
                        <li class="item item-other">
                            <ui-checkbox class="checkbox" v-model="hasOtherChar" label="由我输入的字符" title="想包括什么就输入什么" />
                            <ui-text-field class="input" v-model="otherChar" v-if="hasOtherChar" />
                        </li>
                    </ul>
                </div>
            </div>
            <div class="section">
                <div class="section-title">
                    <h3>选择密码的长度</h3>
                </div>
                <div class="section-body">
                    <ul class="length-list">
                        <li class="item" v-for="len in lengthList">
                            <ui-radio class="radio" v-model="length" :nativeValue="'' + len" :label="len + '位'" name="group"/>
                        </li>
                        <li class="item item-other">
                            <ui-radio class="radio" v-model="length" label="其他位数" name="group" nativeValue="-1"/>
                            <ui-text-field class="input" v-model.number="otherLength" v-if="length === '-1'" />
                        </li>
                    </ul>
                </div>
            </div>
            <div class="btns">
                <ui-raised-button class="btn" primary label="生成密码" @click="make" title="选择好了开始生成密码" />
                <!-- <ui-raised-button class="btn" label="手气不错" @click="make2" title="完全随机试试我的手气" /> -->
                <ui-raised-button class="btn btn-copy" label="复制密码" v-if="this.result"/>
            </div>
            <div class="result-box" v-if="result">{{ result }}</div>
        </div>
    </my-page>
</template>

<script>
    const Clipboard = window.Clipboard

    export default {
        data () {
            return {
                result: '',
                length: 8,
                list: ['0123456789'],
                charList: [
                    {
                        title: '十进制数字 0-9',
                        desc: '十进制的纯数字，从0到9',
                        char: '0123456789'
                    },
                    {
                        title: '特殊字符 @#%等',
                        desc: '特殊的字母，包括~!@#$%^&*()_+}{等',
                        char: '~!@#$%^&*()_+}{'
                    },
                    {
                        title: '小写十六进制 0-f',
                        desc: '十六进制的字符，从0到9再从小写a到f',
                        char: '0123456789abcdef'
                    },
                    {
                        title: '大写十六进制 0-F',
                        desc: '十六进制的字符，从0到9再从大写A到F',
                        char: '0123456789ABCDEF'
                    },
                    {
                        title: '小写英文字母 a-z',
                        desc: '全部小写的英文字母，从a到z',
                        char: 'abcdefghijklmnopqrstuvwxyz'
                    },
                    {
                        title: '大写英文字母 A-Z',
                        desc: '全部大写的英文字母，从A到Z',
                        char: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                    },
                    {
                        title: '二进制数字 0-1',
                        desc: '二进制的纯数字，包括0和1',
                        char: '01'
                    },
                    {
                        title: '八进制数字 0-7',
                        desc: '八进制的纯数字，从0到7',
                        char: '01234567'
                    }
                ],
                lengthList: [5, 8, 12, 32, 128, 512, 6, 9, 14, 64, 256, 999, 7, 10, 16, 100, 1000, 1024],
                hasOtherChar: false,
                otherLength: null,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/bb6e78b0677311e99d6f396278a09a81',
                            target: '_blank',
                            title: '应用'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.init()
            // this.make()
        },
        methods: {
            init() {
                let clipboard = new Clipboard('.btn-copy', {
                    text: trigger => {
                        return this.result
                    }
                })
                clipboard.on('success', function(e) {
                    console.info('Action:', e.action)
                    console.info('Text:', e.text)
                    console.info('Trigger:', e.trigger)
                    e.clearSelection()
                })
                clipboard.on('error', function(e) {
                    console.error('Action:', e.action)
                    console.error('Trigger:', e.trigger)
                })
            },
            make() {
                let str = this.list.join('')
                if (this.hasOtherChar) {
                    str += this.otherChar
                }
                if (!this.length) {
                    this.length = 8
                }
                let length = parseInt(this.length)
                if (length === -1) {
                    length = this.otherLength
                }
                this.result = ''
                for (let i = 0; i < length; i++) {
                    let index = parseInt(Math.random() * str.length)
                    this.result += str[index]
                }
            },
            make2() {
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../scss/var';

    .btns {
        margin-top: 16px;
        margin-bottom: 16px;
        .btn {
            margin-right: 8px;
        }
    }
    .char-list {
        @include clearfix;
        .item {
            float: left;
            width: 25%;
        }
        .item-other {
            width: 50%;
        }
        .input {
            margin-left: 16px;
        }
    }
    .length-list {
         @include clearfix;
        .item {
            float: left;
            width: 16.6%;
        }
        .item-other {
            width: 50%;
        }
        .input {
            margin-left: 16px;
        }
    }
    .result-box {
        max-width: 400px;
        // white-space: nowrap;
        word-wrap: break-word;
    }
    .section {
        margin-bottom: 16px;
        // border: 1px solid #c1e1f6;
        background-color: #fff;
        box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
        .section-title {
            padding: 16px;
            background: #eaf2f9;
            h3 {
                font-size: 16px;
            }
        }
        .section-body {
            padding: 16px;
        }
    }
</style>
