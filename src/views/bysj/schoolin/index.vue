<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="紧急状态" prop="urgency">
        <el-input
          v-model="queryParams.urgency"
          placeholder="请输入紧急状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="填写姓名" prop="inName">
        <el-input
          v-model="queryParams.inName"
          placeholder="请输入填写姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['bysj:schoolin:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bysj:schoolin:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bysj:schoolin:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bysj:schoolin:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="schoolinList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="紧急状态" align="center" prop="urgency">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.urgency_status" :value="scope.row.urgency"/>
        </template>
      </el-table-column>
      <el-table-column label="填写姓名" align="center" prop="inName" />
      <el-table-column label="部门" align="center" prop="bysjDept.deptName" />
      <el-table-column label="提交时间" align="center" prop="subDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.subDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入校时间" align="center" prop="inDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入校原因" align="center" prop="inReason" />
      <el-table-column label="苏康码" align="center" prop="sukang" />
      <el-table-column label="行程卡" align="center" prop="xingcheng" />
      <el-table-column label="核酸检测" align="center" prop="hesuan" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleSH(scope.row)"
            v-hasPermi="['bysj:schoolin:sh']"
          >
          <dict-tag :options="dict.type.shenghe_status" :value="scope.row.status"/>
        </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bysj:schoolin:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bysj:schoolin:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改教工入校对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title" v-if=(!isSH||!isUpdate)>
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="紧急状态" prop="urgency" v-if=(!isSH||!isUpdate)>
          <el-input v-model="form.urgency" placeholder="请输入紧急状态" />
        </el-form-item>
        <el-form-item label="填写姓名" prop="inName" v-if=(!isSH||!isUpdate)>
          <el-input v-model="form.inName" placeholder="请输入填写姓名" />
        </el-form-item>
        <el-form-item label="部门id" prop="deptId" v-if=(!isSH||!isUpdate)>
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item label="提交时间" prop="subDate" v-if=(!isSH||!isUpdate)>
          <el-date-picker clearable
            v-model="form.subDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择提交时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入校时间" prop="inDate" v-if=(!isSH||!isUpdate)>
          <el-date-picker clearable
            v-model="form.inDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择入校时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入校原因" prop="inReason" v-if=(!isSH||!isUpdate)>
          <el-input v-model="form.inReason" placeholder="请输入入校原因" />
        </el-form-item>
        <el-form-item label="苏康码" prop="sukang" v-if=(!isSH||!isUpdate)>
          <imageUpload v-model="form.sukang" />
        </el-form-item>
        <el-form-item label="行程卡" prop="xingcheng" v-if=(!isSH||!isUpdate)>
          <imageUpload v-model="form.xingcheng" />
        </el-form-item>
        <el-form-item label="核酸检测" prop="hesuan" v-if=(!isSH||!isUpdate)>
          <imageUpload v-model="form.hesuan" />
        </el-form-item>
        <el-form-item label="审核状态" prop="status" v-if="isSH">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.shenghe_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark" v-if=(!isSH||!isUpdate)>
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSchoolin, getSchoolin, delSchoolin, addSchoolin, updateSchoolin } from "@/api/bysj/schoolin";
import ImageUpload from '@/components/ImageUpload';
export default {
  name: "Schoolin",
  dicts: ['sys_normal_disable','shenghe_status','urgency_status'],
  data() {
    const currentDate = this.getDate({
				format: true
        })
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 教工入校表格数据
      schoolinList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      isSH:false,
      //
      isUpdate:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        urgency: null,
        inName: null,
        deptId: null,
        subDate: null,
        inDate: null,
        inReason: null,
        sukang: null,
        xingcheng: null,
        hesuan: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询教工入校列表 */
    getList() {
      this.loading = true;
      listSchoolin(this.queryParams).then(response => {
        this.schoolinList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        urgency: null,
        inName: null,
        deptId: null,
        subDate: null,
        inDate: null,
        inReason: null,
        sukang: null,
        xingcheng: null,
        hesuan: null,
        status: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加教工入校";
      this.isUpdate = true;
      this.isSH= false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSchoolin(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改教工入校";
        this.isUpdate = true;
        this.isSH= false;
      });
    },
     /** 审核按钮操作 */
     handleSH(row) {
      this.reset();
      const id = row.id || this.ids
      getSchoolin(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "审核教工离校";
        this.isUpdate = true;
        this.isSH= true;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSchoolin(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSchoolin(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除教工入校编号为"' + ids + '"的数据项？').then(function() {
        return delSchoolin(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bysj/schoolin/export', {
        ...this.queryParams
      }, `schoolin_${new Date().getTime()}.xlsx`)
    },
    getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
  }
};
</script>
