<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="紧急程度" prop="urgency">
        <el-input
          v-model="queryParams.urgency"
          placeholder="请输入紧急程度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人" prop="teacherId">
        <el-input
          v-model="queryParams.teacherId"
          placeholder="请输入申请人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请部门" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入申请部门"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否出省" prop="leaveProvince">
        <el-input
          v-model="queryParams.leaveProvince"
          placeholder="请输入是否出省"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目的地当前风险等级" prop="destRisk" label-width="138px">
        <el-input
          v-model="queryParams.destRisk"
          placeholder="请输入目的地当前风险等级"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="离锡开始日期" prop="startDate" label-width="100px">
        <el-date-picker clearable
          v-model="queryParams.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择离锡开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="拟定返锡日期" prop="backDate" label-width="100px">
        <el-date-picker clearable
          v-model="queryParams.backDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择拟定返锡日期">
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
          v-hasPermi="['bysj:leavewuxi:add']"
        >新增</el-button>
      </el-col>
      <template slot-scope="scope">
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bysj:leavewuxi:edit']"
          >修改</el-button>
        </el-col>
      </template>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bysj:leavewuxi:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bysj:leavewuxi:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leavewuxiList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="紧急程度" align="center" prop="urgency" >
        <template slot-scope="scope">
              <dict-tag :options="dict.type.bysj_jjcd" :value="scope.row.urgency"/>
          </template>
        </el-table-column>
      <el-table-column label="申请人" align="center" prop="sysUser.nickName" />
      <el-table-column label="申请部门" align="center" prop="sysDept.deptName" width="150"/>
      <el-table-column label="是否出省" align="center" prop="leaveProvince" >
      <template slot-scope="scope">
            <dict-tag :options="dict.type.bysj_leave_province" :value="scope.row.leaveProvince"/>
        </template>
      </el-table-column>
      <el-table-column label="离锡事由" align="center" prop="reasons" />
      <el-table-column label="目的地(精确到街道/乡道)" align="center" prop="dest" width="200"/>
      <el-table-column label="目的地当前风险等级" align="center" prop="destRisk" width="150">
      <template slot-scope="scope">
            <dict-tag :options="dict.type.bysj_dest_risk" :value="scope.row.destRisk"/>
        </template>
      </el-table-column>
      <el-table-column label="拟途径路线" align="center" prop="route" width="150"/>
      <el-table-column label="在锡住址(精确到小区)" align="center" prop="address" width="200"/>
      <el-table-column label="离锡开始日期" align="center" prop="startDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拟定返锡日期" align="center" prop="backDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.backDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主要交通方式" align="center" prop="transport" width="150">
        <template slot-scope="scope">
              <dict-tag :options="dict.type.bysj_transport" :value="scope.row.transport"/>
          </template>
        </el-table-column>
      <el-table-column label="防疫承诺确认" align="center" prop="confirm" width="150">
        <template slot-scope="scope">
              <dict-tag :options="dict.type.bysj_confirm" :value="scope.row.confirm"/>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="auditstatus" width="150">
          <template slot-scope="scope">
                <dict-tag :options="dict.type.jypc_shenhe_status" :value="scope.row.auditstatus"/>
            </template>
          </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bysj:leavewuxi:edit']"
          >修改</el-button>
          <el-button
           size="mini"
           type="text"
           icon="el-icon-s-check"
           @click="handleSH(scope.row)"
           v-hasPermi="['bysj:room:sh']"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bysj:leavewuxi:remove']"
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

    <!-- 添加或修改离锡报批对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="紧急程度" prop="urgency" v-if="!isSH || !isUpdate">
          <el-select v-model="form.urgency" placeholder="请选择紧急程度">
              <el-option
                v-for="dict in dict.type.bysj_jjcd"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
       <!-- <el-form-item label="申请人" prop="teacherId">
          <el-input v-model="form.teacherId" placeholder="请输入申请人" />
        </el-form-item> -->
       <!-- <el-form-item label="申请部门" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入申请部门" />
        </el-form-item> -->
        <el-form-item label="是否出省" prop="leaveProvince" v-if="!isSH || !isUpdate">
          <el-select v-model="form.leaveProvince" placeholder="请输入是否出省" >
          <el-option
              v-for="dict in dict.type.bysj_leave_province"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="离锡事由" prop="reasons" v-if="!isSH || !isUpdate">
          <el-input v-model="form.reasons" placeholder="请输入离锡事由" />
        </el-form-item>
        <el-form-item label="目的地(精确到街道/乡道)" prop="dest" v-if="!isSH || !isUpdate">
          <el-input v-model="form.dest" placeholder="请输入目的地(精确到街道/乡道)" />
        </el-form-item>
        <el-form-item label="目的地当前风险等级" prop="destRisk" v-if="!isSH || !isUpdate">
         <el-select v-model="form.destRisk" placeholder="请选择目的地当前风险等级">
             <el-option
               v-for="dict in dict.type.bysj_dest_risk"
               :key="dict.value"
               :label="dict.label"
               :value="dict.value"
             />
           </el-select>
        </el-form-item>
        <el-form-item label="拟途径路线" prop="route" v-if="!isSH || !isUpdate">
          <el-input v-model="form.route" placeholder="请输入拟途径路线" />
        </el-form-item>
        <el-form-item label="在锡住址(精确到小区)" prop="address" v-if="!isSH || !isUpdate">
          <el-input v-model="form.address" placeholder="请输入在锡住址(精确到小区)" />
        </el-form-item>
        <el-form-item label="离锡开始日期" prop="startDate" v-if="!isSH || !isUpdate">
          <el-date-picker clearable
            v-model="form.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择离锡开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="拟定返锡日期" prop="backDate" v-if="!isSH || !isUpdate">
          <el-date-picker clearable
            v-model="form.backDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择拟定返锡日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="主要交通方式" prop="transport" v-if="!isSH || !isUpdate">
          <el-select v-model="form.transport" placeholder="请选择目的地当前风险等级">
              <el-option
                v-for="dict in dict.type.bysj_transport"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
        </el-form-item>
        <el-form-item label="防疫承诺确认" prop="confirm" v-if="!isSH || !isUpdate">
          <!-- <el-input v-model="form.confirm" placeholder="请输入防疫承诺确认" /> -->

         <el-radio-group v-model="form.confirm">
            <el-radio
              v-for="dict in dict.type.bysj_confirm"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditstatus" label-width="200" v-if="isSH">
         <el-radio-group v-model="form.auditstatus">
            <el-radio
              v-for="dict in dict.type.jypc_shenhe_status"
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
import { listLeavewuxi, getLeavewuxi, delLeavewuxi, addLeavewuxi, updateLeavewuxi } from "@/api/bysj/leavewuxi";

export default {
  name: "Leavewuxi",
  dicts: ['bysj_jjcd','bysj_leave_province','bysj_dest_risk','bysj_transport','bysj_confirm','jypc_shenhe_status'],
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
      //当前操作是修改？
      isUpdate:false,
      isSH: false,
      // 离锡报批表格数据
      leavewuxiList: [],
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
        leaveProvince: null,
        reasons: null,
        dest: null,
        destRisk: null,
        route: null,
        address: null,
        startDate: null,
        backDate: null,
        transport: null,
        confirm: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        urgency: [
          { required: true, message: "紧急程度不能为空", trigger: "blur" }
        ],
        teacherId: [
          { required: true, message: "申请人不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "申请部门不能为空", trigger: "blur" }
        ],
        leaveProvince: [
          { required: true, message: "是否出省不能为空", trigger: "blur" }
        ],
        reasons: [
          { required: true, message: "离锡事由不能为空", trigger: "blur" }
        ],
        dest: [
          { required: true, message: "目的地(精确到街道/乡道)不能为空", trigger: "blur" }
        ],
        destRisk: [
          { required: true, message: "目的地当前风险等级不能为空", trigger: "blur" }
        ],
        route: [
          { required: true, message: "拟途径路线不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "在锡住址(精确到小区)不能为空", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "离锡开始日期不能为空", trigger: "blur" }
        ],
        backDate: [
          { required: true, message: "拟定返锡日期不能为空", trigger: "blur" }
        ],
        transport: [
          { required: true, message: "主要交通方式不能为空", trigger: "blur" }
        ],
        confirm: [
          { required: true, message: "防疫承诺确认不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询离锡报批列表 */
    getList() {
      this.loading = true;
      listLeavewuxi(this.queryParams).then(response => {
        this.leavewuxiList = response.rows;
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
        urgency: null,
        teacherId: null,
        deptId: null,
        leaveProvince: null,
        reasons: null,
        dest: null,
        destRisk: null,
        route: null,
        address: null,
        startDate: null,
        backDate: null,
        transport: null,
        confirm: null,
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
      this.isUpdate=true;
      this.isSH = false;
      this.title = "添加离锡报批";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLeavewuxi(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.isUpdate=true;
        this.isSH = false;
        this.title = "修改离锡报批";
      });
    },
    handleSH(row) {
     this.reset();
     const id = row.id || this.ids
     getLeavewuxi(id).then(response => {
       this.form = response.data;
       this.open = true;
       this.title = "审核离锡报批订单";
       this.isUpdate=true;
       this.isSH = true
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLeavewuxi(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLeavewuxi(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除离锡报批编号为"' + ids + '"的数据项？').then(function() {
        return delLeavewuxi(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bysj/leavewuxi/export', {
        ...this.queryParams
      }, `leavewuxi_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
