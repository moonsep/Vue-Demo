<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="75px">
      
      <el-form-item label="用餐日期" prop="mealsDate">
        <el-date-picker clearable
          v-model="queryParams.mealsDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择用餐日期">
        </el-date-picker>
      </el-form-item>
      
      <el-form-item label="陪餐人" prop="withmealsName">
        <el-input
          v-model="queryParams.withmealsName"
          placeholder="请输入陪餐人姓名"
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
          v-hasPermi="['bysj:meals:add']"
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
          v-hasPermi="['bysj:meals:edit']"
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
          v-hasPermi="['bysj:meals:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bysj:meals:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mealsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="接待人" align="center" prop="receptionid" />
      <el-table-column label="用餐日期" align="center" prop="mealsDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.mealsDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用餐类型" align="center" prop="mealsType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.meals_type" :value="scope.row.mealsType"/>
        </template>
      </el-table-column>
      <el-table-column label="陪餐人数" align="center" prop="withmealsNumber" />
      <el-table-column label="陪餐人姓名" align="center" prop="withmealsName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
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
            v-hasPermi="['bysj:meals:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bysj:meals:remove']"
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

    <!-- 添加或修改用餐对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用餐日期" prop="mealsDate">
          <el-date-picker clearable
            v-model="form.mealsDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择用餐日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="接待人" prop="receptionid">
          <el-input v-model="form.receptionid" placeholder="请输入接待人" />
        </el-form-item>
        <el-form-item label="用餐类型" prop="mealsType">
          <el-radio-group v-model="form.mealsType">
            <el-radio
              v-for="dict in dict.type.meals_type"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="陪餐人数" prop="withmealsNumber">
          <el-input v-model="form.withmealsNumber" placeholder="请输入陪餐人数" />
        </el-form-item>
        <el-form-item label="陪餐人姓名" prop="withmealsName">
          <el-input v-model="form.withmealsName" placeholder="请输入陪餐人姓名" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
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
import { listMeals, getMeals, delMeals, addMeals, updateMeals } from "@/api/bysj/meals";

export default {
  name: "Meals",
  dicts: ['sys_normal_disable','meals_type','shenghe_status'],
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
      // 用餐表格数据
      mealsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        receptionid: null,
        mealsDate: null,
        mealsType: null,
        withmealsNumber: null,
        withmealsName: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        receptionid: [
          { required: true, message: "接待人为必填项！", trigger: "blur" }
        ],
        mealsDate: [
          { required: true, message: "用餐日期不能为空", trigger: "blur" }
        ],
        withmealsName: [
          { required: true, message: "陪餐人员不能为空", trigger: "blur" }
        ],
        withmealsNumber: [
          { required: true, message: "陪餐人数不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用餐列表 */
    getList() {
      this.loading = true;
      listMeals(this.queryParams).then(response => {
        this.mealsList = response.rows;
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
        receptionid: '1',
        mealsDate: null,
        mealsType: "0",
        withmealsNumber: null,
        withmealsName: null,
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
      this.title = "添加用餐";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMeals(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用餐";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMeals(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMeals(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用餐编号为"' + ids + '"的数据项？').then(function() {
        return delMeals(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bysj/meals/export', {
        ...this.queryParams
      }, `meals_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
