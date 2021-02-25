<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--        卡片视图区域-->
        <el-card>
            <!--            搜索添加区域-->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>

            <!--            用户列表区域-->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.ms_state" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template>
                        <!--                        修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <!--                        删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <!--                        分配角色按钮-->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!--            分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryinfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryinfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--        添加用户对话框-->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!--            内容主体区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--            底部区域-->
            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            //验证邮箱规则
            var checkMobile = (rule, value, cb) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if (regMobile.test(value)) {
                    // 合法的手机号码
                    return cb()
                }
                cb(new Error('手机号码格式不正确'))
            };
            var checkEmail = (rule, value, cb) => {
                const regEmail = /^([a-zA-Z]|[0-9])+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
                if (regEmail.test(value)) {
                    // 合法的邮箱
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            }
            return {
                // 获取用户列表的参数对象
                queryinfo: {
                    query: '',
                    //当前页数
                    pagenum: 1,
                    //当前每页显示多少条数据
                    pagesize: 10
                },
                userlist: [],
                total: 0,
                addDialogVisible: false,
                //添加用户的表单数据
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                },
                // 表单验证规则
                addFormRules: {
                    username: [
                        {required: true, message: '请输入登陆名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    // 验证用户名是否合法
                    password: [
                        {required: true, message: '请输入登陆密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'},
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'},
                    ],
                },
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('https://www.liulongbin.top:8888/api/private/v1/users', {params: this.queryinfo})
              console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户列表失败')
                }
                this.userlist = res.data.users
                this.total = res.data.total
            },
            // 监听pagesize改变事件
            handleSizeChange(newSize) {
                this.queryinfo.pagesize = newSize
                this.getUserList()
            },
            //    监听页码值改变事件
            handleCurrentChange(newPage) {
                this.queryinfo.pagenum = newPage
                this.getUserList()
            },
            //监听switch开关状态改变
            async userStateChange(userInfo) {
                const {data: res} = await this.$http.put(`https://www.liulongbin.top:8888/api/private/v1/users/${userInfo.id}/state/${userInfo.mg_state}`)
                if (res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error('更新用户状态失败')
                }
                this.$message.success('更新用户状态成功')
            },
            //    监听添加用户对话框关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            adduser() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.post('https://www.liulongbin.top:8888/api/private/v1/users', this.addForm)
                    if (res.meta.status !==201)  {
                        this.$message.error('用户添加失败')
                    }
                    this.$message.success('用户添加成功')
                    //添加成功后隐藏对话框
                    this.addDialogVisible =false
                    //刷新用户列表
                    this.getUserList()
                })
            },
        }
    }
</script>

<style lang="less" scoped>

</style>