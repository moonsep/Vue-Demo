<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="住宿单位" prop="receptionid">
        <el-input
          v-model="queryParams.receptionid"
          placeholder="请输入作外键"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="overnightBegin">
        <el-date-picker clearable
          v-model="queryParams.overnightBegin"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="overnightEnd">
        <el-date-picker clearable
          v-model="queryParams.overnightEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束时间">
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
          v-hasPermi="['bysj:overnight:add']"
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
          v-hasPermi="['bysj:overnight:edit']"
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
          v-hasPermi="['bysj:overnight:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bysj:overnight:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="overnightList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="住宿单位" align="center" prop="receptionid" />
      <el-table-column label="开始时间" align="center" prop="overnightBegin" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.overnightBegin, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="overnightEnd" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.overnightEnd, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="住宿说明" align="center" prop="overnightDemand" />
        <template></template>
      </el-table-column>
      <el-table-column label="经费来源" align="center" prop="costSource" />
      <el-table-column label="其他说明" align="center" prop="otherDemand" />
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
            v-hasPermi="['bysj:overnight:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bysj:overnight:remove']"
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

    <!-- 添加或修改住宿对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="住宿单位" prop="receptionid">
          <el-input v-model="form.receptionid" placeholder="请输入作外键" />
        </el-form-item>
        <el-form-item label="开始时间" prop="overnightBegin">
          <el-date-picker clearable
            v-model="form.overnightBegin"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="overnightEnd">
          <el-date-picker clearable
            v-model="form.overnightEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="住宿说明" prop="overnightDemand">
          <el-input v-model="form.overnightDemand" placeholder="请输入住宿说明" />
        </el-form-item>
        <el-form-item label="经费来源" prop="costSource">
          <el-input v-model="form.costSource" placeholder="请输入经费来源" />
        </el-form-item>
        <el-form-item label="其他说明" prop="otherDemand">
          <imageUpload v-model="form.overnightDemand" @removeImage="removeImage"  @input="geturl"/>
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
import { listOvernight, getOvernight, delOvernight, addOvernight, updateOvernight } from "@/api/bysj/overnight";
import ImageUpload from '@/components/ImageUpload';
export default {
  components: {
	    ImageUpload,
	  },
  name: "Overnight",
  dicts: ['sys_normal_disable','meals_type','shenghe_status','if_true_false'],
  data() {
    return {
      photos:[], 
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
      // 住宿表格数据
      overnightList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        receptionid: null,
        overnightBegin: null,
        overnightEnd: null,
        overnightDemand: null,
        costSource: null,
        otherDemand: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        receptionid: [
          { required: true, message: "作外键不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    removeImage(value){
	     	if(value){
	     		this.form.photos = this.form.photos.replace(this.form.photos.indexOf(','+value)==-1?value+',':','+value,'')
	     	}     		 
	     	
   		 },
	    geturl(url){
		      if (this.form.photos){
		        	this.form.photos=this.form.photos+(','+url);
		      }else {
        			this.form.photos=url;
      		  }
	    },
    /** 查询住宿列表 */
    getList() {
      this.loading = true;
      listOvernight(this.queryParams).then(response => {
        this.overnightList = response.rows;
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
        overnightBegin: null,
        overnightEnd: null,
        overnightDemand: null,
        costSource: null,
        otherDemand: null,
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
      this.title = "添加住宿";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOvernight(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改住宿";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOvernight(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOvernight(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除住宿编号为"' + ids + '"的数据项？').then(function() {
        return delOvernight(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bysj/overnight/export', {
        ...this.queryParams
      }, `overnight_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
