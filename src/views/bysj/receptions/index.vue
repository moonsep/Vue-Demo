<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="申请部门" prop="applicationDepartment">
        <el-input
          v-model="queryParams.applicationDepartment"
          placeholder="请输入申请部门"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请日期" prop="applicationDate">
        <el-date-picker clearable
          v-model="queryParams.applicationDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择申请日期">
        </el-date-picker>
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
          v-hasPermi="['bysj:receptions:add']"
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
          v-hasPermi="['bysj:receptions:edit']"
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
          v-hasPermi="['bysj:receptions:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bysj:receptions:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="receptionsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请人" align="center" prop="applicant" />
      <el-table-column label="申请部门" align="center" prop="applicationDepartment" />
      <el-table-column label="申请日期" align="center" prop="applicationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applicationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来访单位" align="center" prop="visitingUnit" />
      <el-table-column label="来访人数" align="center" prop="visitingNumber" />
      <el-table-column label="领队姓名" align="center" prop="leaderName" />
      <el-table-column label="领队职务" align="center" prop="leaderPosition" />
      <el-table-column label="领队电话" align="center" prop="leaderPhone" />
      <el-table-column label="来访原因" align="center" prop="visitingReason" />
      <el-table-column label="是否用餐" align="center" prop="ifMeals">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.if_true_false" :value="scope.row.ifMeals"/>
        </template>
      </el-table-column>
      <el-table-column label="是否住宿" align="center" prop="ifOvernight">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.if_true_false" :value="scope.row.ifOvernight"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.shenghe_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bysj:receptions:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bysj:receptions:remove']"
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

    <!-- 添加或修改公务接待对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="申请人" prop="applicant">
          <el-input v-model="form.applicant" placeholder="请输入申请人" />
        </el-form-item>
        <el-form-item label="申请部门" prop="applicationDepartment">
          <el-input v-model="form.applicationDepartment" placeholder="请输入申请部门" />
        </el-form-item>
        <el-form-item label="申请日期" prop="applicationDate">
          <el-date-picker clearable
            v-model="form.applicationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="来访单位" prop="visitingUnit">
          <el-input v-model="form.visitingUnit" placeholder="请输入来访单位" />
        </el-form-item>
        <el-form-item label="来访人数" prop="visitingNumber">
          <el-input v-model="form.visitingNumber" placeholder="请输入来访人数" />
        </el-form-item>
        <el-form-item label="领队姓名" prop="leaderName">
          <el-input v-model="form.leaderName" placeholder="请输入领队姓名" />
        </el-form-item>
        <el-form-item label="领队职务" prop="leaderPosition">
          <el-input v-model="form.leaderPosition" placeholder="请输入领队职务" />
        </el-form-item>
        <el-form-item label="领队电话" prop="leaderPhone">
          <el-input v-model="form.leaderPhone" placeholder="请输入领队电话" />
        </el-form-item>
        <el-form-item label="来访原因" prop="visitingReason">
          <el-input v-model="form.visitingReason" placeholder="请输入来访原因" />
        </el-form-item>
        <el-form-item label="是否用餐" prop="ifMeals">
          <el-radio-group v-model="form.ifMeals">
            <el-radio
              v-for="dict in dict.type.if_true_false"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否住宿" prop="ifOvernight">
          <el-radio-group v-model="form.ifOvernight">
            <el-radio
              v-for="dict in dict.type.if_true_false"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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
import { listReceptions, getReceptions, delReceptions, addReceptions, updateReceptions } from "@/api/bysj/receptions";

export default {
  name: "Receptions",
  dicts: ['sys_normal_disable','meals_type','shenghe_status','if_true_false'],
  data() {
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
      // 公务接待表格数据
      receptionsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        receptionid: null,
        applicant: null,
        applicationDepartment: null,
        applicationDate: null,
        orderStatus: null,
        visitingUnit: null,
        visitingNumber: null,
        leaderName: null,
        leaderPosition: null,
        leaderPhone: null,
        visitingReason: null,
        ifMeals: null,
        ifOvernight: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        receptionid: [
          { required: true, message: "接待单的id  作外键用不能为空", trigger: "blur" }
        ],
        applicant: [
          { required: true, message: "申请人不能为空", trigger: "blur" }
        ],
        applicationDepartment: [
          { required: true, message: "申请部门不能为空", trigger: "blur" }
        ],
        applicationDate: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        orderStatus: [
          { required: true, message: "表单状态不能为空", trigger: "blur" }
        ],
        visitingUnit: [
          { required: true, message: "来访单位不能为空", trigger: "blur" }
        ],
        visitingNumber: [
          { required: true, message: "来访人数不能为空", trigger: "blur" }
        ],
        leaderName: [
          { required: true, message: "领队姓名不能为空", trigger: "blur" }
        ],
        leaderPosition: [
          { required: true, message: "领队职务不能为空", trigger: "blur" }
        ],
        leaderPhone: [
          { required: true, message: "领队电话不能为空", trigger: "blur" }
        ],
        visitingReason: [
          { required: true, message: "来访原因不能为空", trigger: "blur" }
        ],
        ifMeals: [
          { required: true, message: "是否用餐 1为是 0为否不能为空", trigger: "blur" }
        ],
        ifOvernight: [
          { required: true, message: "是否住宿  1为是 0为否不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公务接待列表 */
    getList() {
      this.loading = true;
      listReceptions(this.queryParams).then(response => {
        this.receptionsList = response.rows;
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
        receptionid: null,
        applicant: null,
        applicationDepartment: null,
        applicationDate: null,
        orderStatus: 0,
        visitingUnit: null,
        visitingNumber: null,
        leaderName: null,
        leaderPosition: null,
        leaderPhone: null,
        visitingReason: null,
        ifMeals: null,
        ifOvernight: null,
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
      this.title = "添加公务接待";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReceptions(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公务接待";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateReceptions(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReceptions(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除公务接待编号为"' + ids + '"的数据项？').then(function() {
        return delReceptions(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bysj/receptions/export', {
        ...this.queryParams
      }, `receptions_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
