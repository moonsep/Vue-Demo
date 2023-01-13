<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="140px">
      <el-form-item label="电子屏横幅展板选择" prop="type">
      <el-select v-model="queryParams.type" placeholder="电子屏横幅展板选择" clearable>
        <el-option
          v-for="dict in dict.type.bysj_type"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
      </el-form-item>
      <el-form-item label="紧急程度" prop="urgency">
      <el-select v-model="queryParams.urgency" placeholder="紧急程度选择" clearable>
        <el-option
          v-for="dict in dict.type.bysj_jjcd"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
      </el-form-item>

      <el-form-item label="联系方式" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系方式"
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
          v-hasPermi="['bysj:screen:add']"
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
          v-hasPermi="['bysj:screen:edit']"
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
          v-hasPermi="['bysj:screen:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bysj:screen:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="screenList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="screenId" />
      <el-table-column label="紧急程度" align="center" prop="urgency" >
      <template slot-scope="scope">
          <dict-tag :options="dict.type.bysj_jjcd" :value="scope.row.urgency"/>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="sysUser.nickName" />
      <el-table-column label="申请部门" align="center" prop="sysDept.deptName" />
      <el-table-column label="电子屏横幅展板选择" align="center" prop="type" width="180">
      <template slot-scope="scope">
          <dict-tag :options="dict.type.bysj_type" :value="scope.row.type"/>
        </template>
        </el-table-column>
      <el-table-column label="放置地点" align="center" prop="place" />
      <el-table-column label="联系方式" align="center" prop="phone" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容和数量" align="center" prop="content" />
      <el-table-column label="审核状态" align="center" prop="shstatus">
            <template slot-scope="scope">
                <dict-tag :options="dict.type.bysj_shenhe_status" :value="scope.row.shstatus"/>
              </template>
            </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bysj:screen:edit']"
          >修改</el-button>
          <el-button
           size="mini"
           type="text"
           icon="el-icon-s-check"
           @click="handleSH(scope.row)"
           v-hasPermi="['bysj:screen:sh']"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bysj:screen:remove']"
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

    <!-- 添加或修改电子屏、横幅、展板申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="展板选择" prop="type"  v-if="!isSH || !isUpdate">
          <el-select v-model="form.type" placeholder="电子屏横幅展板选择" clearable>
            <el-option
              v-for="dict in dict.type.bysj_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="紧急程度" prop="urgency"  v-if="!isSH || !isUpdate">
          <el-radio-group v-model="form.urgency">
            <el-radio
              v-for="dict in dict.type.bysj_jjcd"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="放置地点" prop="place"  v-if="!isSH || !isUpdate">
          <el-input v-model="form.place" placeholder="请输入放置地点" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone"  v-if="!isSH || !isUpdate">
          <el-input v-model="form.phone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime"  v-if="!isSH || !isUpdate">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime"  v-if="!isSH || !isUpdate">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内容和数量" prop="content"  v-if="!isSH || !isUpdate">
          <el-input v-model="form.content" type="textarea"/>
        </el-form-item>
        <el-form-item label="审核状态" prop="shstatus" v-if="isSH">
          <el-radio-group v-model="form.shstatus">
            <el-radio
              v-for="dict in dict.type.bysj_shenhe_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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
import { listScreen, getScreen, delScreen, addScreen, updateScreen } from "@/api/bysj/screen";

export default {
  name: "Screen",
  dicts: ['bysj_jjcd','bysj_type','sys_normal_disable','bysj_shenhe_status'],
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
      isUpdate:false,
      isSH: false,
      // 电子屏、横幅、展板申请表格数据
      screenList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        urgency: null,
        teacherId: null,
        deptId: null,
        type: null,
        place: null,
        phone: null,
        startTime: null,
        endTime: null,
        content: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        urgency: [
          { required: true, message: "紧急程度(0正常 1重要 2紧急)不能为空", trigger: "blur" }
        ],
        teacherId: [
          { required: true, message: "申请人不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "电子屏横幅展板选择(0电子屏 1横幅 2展板)不能为空", trigger: "change" }
        ],
        place: [
          { required: true, message: "放置地点不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "联系方式不能为空", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容和数量不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询电子屏、横幅、展板申请列表 */
    getList() {
      this.loading = true;
      listScreen(this.queryParams).then(response => {
        this.screenList = response.rows;
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
        screenId: null,
        urgency: "0",
        teacherId: null,
        type: null,
        place: null,
        phone: null,
        startTime: null,
        endTime: null,
        content: null,
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
      this.ids = selection.map(item => item.screenId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isUpdate=true;
      this.isSH = false;
      this.title = "添加电子屏、横幅、展板申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const screenId = row.screenId || this.ids
      getScreen(screenId).then(response => {
        this.form = response.data;
        this.open = true;
        this.isUpdate=true;
        this.isSH = false;
        this.title = "修改电子屏、横幅、展板申请";
      });
    },
    handleSH(row) {
     this.reset();
     const screenId = row.screenId || this.ids
     getScreen(screenId).then(response => {
       this.form = response.data;
       this.open = true;
       this.title = "审核申请订单";
       this.isUpdate=true;
       this.isSH = true
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.screenId != null) {
            updateScreen(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addScreen(this.form).then(response => {
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
      const screenIds = row.screenId || this.ids;
      this.$modal.confirm('是否确认删除电子屏、横幅、展板申请编号为"' + screenIds + '"的数据项？').then(function() {
        return delScreen(screenIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bysj/screen/export', {
        ...this.queryParams
      }, `screen_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
