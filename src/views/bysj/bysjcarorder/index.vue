<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="紧急程度" prop="urgency">
        <el-select v-model="queryParams.urgency" placeholder="请选择紧急程度" clearable>
          <el-option
            v-for="dict in dict.type.bysj_urgency"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入申请人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请部门" prop="departmentId">
       <el-select v-model="queryParams.departmentId" placeholder="请选择所属系部" clearable>
         <el-option
           v-for="item in departmentList"
           :key="item.departmentId"
           :label="item.departmentName"
           :value="item.departmentId"
         />
       </el-select>
      </el-form-item>
      <el-form-item label="用车性质" prop="useCar">
        <el-select v-model="queryParams.useCar" placeholder="请选择用车性质" clearable>
          <el-option
            v-for="dict in dict.type.bysj_ycxz"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
     <!-- <el-form-item label="带队教师" prop="teacherId">
        <el-input
          v-model="queryParams.teacherId"
          placeholder="请输入带队教师"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
          v-hasPermi="['bysj:bysjcarorder:add']"
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
          v-hasPermi="['bysj:bysjcarorder:edit']"
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
          v-hasPermi="['bysj:bysjcarorder:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bysj:bysjcarorder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="carorderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单编号" align="center" prop="carorderId" />
      <el-table-column label="紧急程度" align="center" prop="urgency" >
        <template slot-scope="scope">
              <dict-tag :options="dict.type.bysj_urgency" :value="scope.row.urgency"/>
            </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="createBy" />
      <el-table-column label="申请时间" align="center" prop="applicationTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applicationTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请部门" align="center" prop="bysjDept.departmentName" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="用车性质" align="center" prop="useCar" >
        <template slot-scope="scope">
                <dict-tag :options="dict.type.bysj_ycxz" :value="scope.row.useCar"/>
        </template>
      </el-table-column>
      <el-table-column label="教师类用车类型" align="center" prop="teacherCar" >
        <template slot-scope="scope" >
                <dict-tag :options="dict.type.bysj_teachercar" :value="scope.row.teacherCar"/>
        </template>
    <!--    <template slot-scope="scope" v-else>
                <dict-tag :options="dict.type.bysj_studentcar" :value="scope.row.studentCar"/>
        </template> -->
      </el-table-column>
     <el-table-column label="学生类用车类型" align="center" prop="studentCar" >
        <template slot-scope="scope">
                <dict-tag :options="dict.type.bysj_studentcar" :value="scope.row.studentCar"/>
        </template>
      </el-table-column>
      <el-table-column label="带队教师" align="center" prop="teacherId" />
      <el-table-column label="审核状态" align="center" prop="status" >
        <template slot-scope="scope" >
          <el-button type="text" @click="handleShenHe(scope.row)"  v-hasPermi="['bysj:bysjcarorder:edit']" >
            <dict-tag :options="dict.type.shenhe_status" :value="scope.row.status" />
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注信息" align="center" prop="remark" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bysj:bysjcarorder:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bysj:bysjcarorder:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-unfold"
            @click="handleView(scope.row)"
            v-hasPermi="['bysj:bysjcarorder:list']"
          >查看</el-button>
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

    <!-- 添加或修改业务用车对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="紧急程度" prop="urgency">
          <el-radio-group v-model="form.urgency">
              <el-radio
                v-for="dict in dict.type.bysj_urgency"
                :key="dict.value"
                :label="dict.value"
              >{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        <el-form-item label="申请时间" prop="applicationTime">
          <el-date-picker clearable
            v-model="form.applicationTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择申请时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用车事由" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入用车事由" />
        </el-form-item>
        <el-form-item label="申请部门" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="请选择所属系部" clearable>
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start">
          <el-date-picker clearable
            v-model="form.start"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出行人数" prop="number">
          <el-input v-model="form.number" placeholder="请输入出行人数" />
        </el-form-item>
        <el-form-item label="目的地" prop="destination">
          <el-input v-model="form.destination" placeholder="请输入目的地" />
        </el-form-item>
    <!--    <el-form-item label="乘车地点" prop="place">
          <el-input v-model="form.place" placeholder="请输入乘车地点" />
        </el-form-item> -->
        <el-form-item label="返程时间" prop="returnds">
          <el-date-picker clearable
            v-model="form.returnds"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择返程时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用车需求补充说明" prop="additional">
          <el-input v-model="form.additional" placeholder="请输入用车需求补充说明" />
        </el-form-item>
        <el-form-item label="用车性质" prop="useCar">
          <el-select v-model="form.useCar" placeholder="请选择用车性质" @change="modChange" clearable>
            <el-option
              v-for="dict in dict.type.bysj_ycxz"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="教师用车类型"  prop="teacherCar" v-if="moxs">
          <el-select v-model="form.teacherCar" placeholder="请选择教师用车类型" clearable>
            <el-option
              v-for="dict in dict.type.bysj_teachercar"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学生类用车类型"  prop="studentCar"  v-if="maoxs">
            <el-select v-model="form.studentCar" placeholder="请选择学生类用车类型" clearable>
              <el-option
                v-for="dict in dict.type.bysj_studentcar"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
        </el-form-item>
        <el-form-item label="带队教师" prop="teacherId">
          <el-input v-model="form.teacherId" placeholder="请输入带队教师" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="opens" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审核状态" prop="status">
          <el-radio-group v-model="form.status" >
              <el-radio
                v-for="dict in dict.type.shenhe_status"
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
import { listbysjCarorder, getbysjCarorder, delbysjCarorder, addbysjCarorder, updatebysjCarorder  } from "@/api/bysj/bysjcarorder";
import { listDeptAll } from "@/api/bysj/dept"
export default {
  name: "BysjCarorder",
  dicts:['bysj_urgency','shenhe_status','bysj_ycxz','bysj_teachercar','bysj_studentcar'],
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
      // 业务用车表格数据
      carorderList: [],
      //申请部门表格数据
      departmentList:[],
      // 弹出层标题
      title: "",
      //
      moxs: false,
      //
      maoxs: false,
      // 是否显示弹出层
      open: false,
      //是否显示审核弹出层
      opens: false,
      // 查询参数
      queryParams  : {
        pageNum: 1,
        pageSize: 10,
        urgency: null,
        userId: null,
        applicationTime: null,
        reason: null,
        departmentId: null,
        phone: null,
        start: null,
        number: null,
        destination: null,
        place: null,
        returnds: null,
        additional: null,
        useCar: null,
        teacherCar: null,
        teacherId: null,
        studentCar: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        reason: [
          { required: true, message: "用车事由不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        start: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        number: [
          { required: true, message: "出行人数不能为空", trigger: "blur" }
        ],
        destination: [
          { required: true, message: "目的地不能为空", trigger: "blur" }
        ],
        returnds: [
          { required: true, message: "返程时间不能为空", trigger: "blur" }
        ],
        useCar: [
          { required: true, message: "用车性质不能为空", trigger: "blur" }
        ],
        teacherId: [
          { required: true, message: "带队教师不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    // this.siftCar();
    this.getBysjDepartmentList();
  },
  methods: {
    /** 查询业务用车列表 */
    getList() {
      this.loading = true;
      listbysjCarorder(this.queryParams).then(response => {
        this.carorderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getBysjDepartmentList(){
      listDeptAll().then(
        response =>{
          this.departmentList = response.rows;
        }
      );
    },
    // //用车类型筛选
    // siftCar(userCar){
    //   if(userCar==1){
    //     this.moxs = true;
    //   }else{
    //     this.moxs = false;
    //   }
    // },
    modChange(selectValue){
      if(selectValue == 1){
        this.moxs = true;
        this.maoxs = false;
      }else {
        this.maoxs =true;
        this.moxs = false;
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.opens =false;
      this.moxs = false;
      this.maoxs = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        carorderId: null,
        urgency: "0",
        userId: null,
        applicationTime: null,
        reason: null,
        departmentId: null,
        phone: null,
        start: null,
        number: null,
        destination: null,
        place: null,
        returnds: null,
        additional: null,
        useCar: null,
        teacherCar: null,
        teacherId: null,
        studentCar: null,
        status: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.ids = selection.map(item => item.carorderId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加业务用车";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      console.log(row);
      const carorderId = row.carorderId || this.ids
      getbysjCarorder(carorderId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改业务用车";
      });
    },
    /** 修改审核状态按钮操作 */
    handleShenHe(row) {
      this.reset();
      const carorderId = row.carorderId || this.ids
      getbysjCarorder(carorderId).then(response => {
        this.form = response.data;
        this.opens = true;
        this.title = "修改审核状态";
      });
    },
    /**查看按钮操作 */
    handleView(row) {
    console.log(row.carorderId);
      this.$router.push({
        path:'/bysj/bysjcarorder-data/index/' + row.carorderId
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.carorderId != null) {
            updatebysjCarorder(this.form).then(response => {
              console.log(this.form);
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.opens =false;
              this.getList();
            });
          } else {
            addbysjCarorder(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.opens =false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const carorderIds = row.carorderId || this.ids;
      this.$modal.confirm('是否确认删除业务用车编号为"' + carorderIds + '"的数据项？').then(function() {
        return delbysjCarorder(carorderIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bysj/bysjcarorder/export', {
        ...this.queryParams
      }, `carorder_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
