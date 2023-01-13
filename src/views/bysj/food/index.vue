<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="85px">
      <el-form-item label="订餐申请人" prop="teacherId">
        <el-input
          v-model="queryParams.teacherId"
          placeholder="请输入订餐申请人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用餐人" prop="diner">
        <el-input
          v-model="queryParams.diner"
          placeholder="请输入用餐人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订餐时间" prop="foodTime">
        <el-date-picker clearable
          v-model="queryParams.foodTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择订餐时间">
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
          v-hasPermi="['bysj:food:add']"
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
          v-hasPermi="['bysj:food:edit']"
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
          v-hasPermi="['bysj:food:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bysj:food:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="foodList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订餐编号" align="center" prop="foodId" />
      <el-table-column label="订餐申请人" align="center" prop="teacherId" />
      <el-table-column label="用餐人" align="center" prop="diner" />
      <el-table-column label="订餐时间" align="center" prop="foodTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.foodTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="午餐" align="center" prop="lunch" >
		<template slot-scope="scope">
		<dict-tag :options="dict.type.bysj_dc" :value="scope.row.lunch"/>
		</template>
		</el-table-column>
      <el-table-column label="周一" align="center" prop="monday" >
	    <template slot-scope="scope">
	    <dict-tag :options="dict.type.bysj_dc" :value="scope.row.monday"/>
	    </template>
		</el-table-column>
      <el-table-column label="周二" align="center" prop="tuesday" >
	    <template slot-scope="scope">
	    <dict-tag :options="dict.type.bysj_dc" :value="scope.row.tuesday"/>
	    </template>
		</el-table-column>
      <el-table-column label="周三" align="center" prop="wednesday" >
	    <template slot-scope="scope">
	    <dict-tag :options="dict.type.bysj_dc" :value="scope.row.wednesday"/>
	    </template>
		</el-table-column>
      <el-table-column label="周四" align="center" prop="thursday" >
	    <template slot-scope="scope">
	    <dict-tag :options="dict.type.bysj_dc" :value="scope.row.thursday"/>
	    </template>
		</el-table-column>
      <el-table-column label="周五" align="center" prop="friday" >
	    <template slot-scope="scope">
	    <dict-tag :options="dict.type.bysj_dc" :value="scope.row.friday"/>
	    </template>
		</el-table-column>
	  <el-table-column label="状态" align="center" prop="updateBy" >
	    <template slot-scope="scope">
	    <dict-tag :options="dict.type.bysj_sh" :value="scope.row.updateBy"/>
	    </template>
	  	</el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bysj:food:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bysj:food:remove']"
          >删除</el-button>
					<el-button
					  size="mini"
					  type="text"
					  icon="el-icon-edit"
					  @click="handleSH(scope.row)"
					  v-hasPermi="['bysj:food:process']"
					>审核</el-button>
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

    <!-- 添加或修改一周订餐对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="订餐申请人" prop="teacherId" v-if="!isSH || !isUpdate">
          <el-input v-model="form.teacherId" placeholder="请输入订餐申请人" />
        </el-form-item>
        <el-form-item label="用餐人" prop="diner" v-if="!isSH || !isUpdate">
          <el-input v-model="form.diner" placeholder="请输入用餐人" />
        </el-form-item>
        <el-form-item label="订餐时间" prop="foodTime" v-if="!isSH || !isUpdate">
          <el-date-picker clearable
            v-model="form.foodTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择订餐时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="午餐" prop="lunch" v-if="!isSH || !isUpdate">
            <el-select v-model="form.lunch" placeholder="请选择">
                        <el-option
                          v-for="dict in dict.type.bysj_dc"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
        </el-form-item>
        <el-form-item label="周一" prop="monday" v-if="!isSH || !isUpdate">
          <el-select v-model="form.monday" placeholder="请选择">
                      <el-option
                        v-for="dict in dict.type.bysj_dc"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
        </el-form-item>
        <el-form-item label="周二" prop="tuesday" v-if="!isSH || !isUpdate">
          <el-select v-model="form.tuesday" placeholder="请选择">
                      <el-option
                        v-for="dict in dict.type.bysj_dc"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
        </el-form-item>
        <el-form-item label="周三" prop="wednesday" v-if="!isSH || !isUpdate">
          <el-select v-model="form.wednesday" placeholder="请选择">
                      <el-option
                        v-for="dict in dict.type.bysj_dc"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
        </el-form-item>
        <el-form-item label="周四" prop="thursday" v-if="!isSH || !isUpdate">
          <el-select v-model="form.thursday" placeholder="请选择">
                      <el-option
                        v-for="dict in dict.type.bysj_dc"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
        </el-form-item>
        <el-form-item label="周五" prop="friday" v-if="!isSH || !isUpdate">
          <el-select v-model="form.friday" placeholder="请选择">
                      <el-option
                        v-for="dict in dict.type.bysj_dc"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
		<el-form-item label="状态" prop="updateBy" v-if="isSH">
		  <el-select v-model="form.updateBy" placeholder="请选择">
		              <el-option
		                v-for="dict in dict.type.bysj_sh"
		                :key="dict.value"
		                :label="dict.label"
		                :value="dict.value"
		              />
		            </el-select>
		          </el-form-item>
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
import { listFood, getFood, delFood, addFood, updateFood } from "@/api/bysj/food";

export default {
  name: "Food",
  dicts: ['bysj_dc','bysj_sh'],
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
      // 一周订餐表格数据
	    isUpdate:false,
	    isSH: false,
      foodList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        teacherId: null,
        diner: null,
        foodTime: null,
        lunch: null,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        teacherId: [
          { required: true, message: "订餐申请人不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询一周订餐列表 */
    getList() {
      this.loading = true;
      listFood(this.queryParams).then(response => {
        this.foodList = response.rows;
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
        foodId: null,
        teacherId: null,
        diner: null,
        foodTime: null,
        lunch: null,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
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
      this.ids = selection.map(item => item.foodId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
	  this.isUpdate=true;
	  this.isSH = false;
      this.title = "添加一周订餐";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const foodId = row.foodId || this.ids
      getFood(foodId).then(response => {
        this.form = response.data;
        this.open = true;
		this.isUpdate=true;
		this.isSH = false;
        this.title = "修改一周订餐";
      });
    },
	handleSH(row) {
	     this.reset();
	     const foodId = row.foodId || this.ids
	     getFood(foodId).then(response => {
	       this.form = response.data;
	       this.open = true;
	       this.title = "审核一周订餐";
	       this.isUpdate=true;
	       this.isSH = true
	      });
	    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.foodId != null) {
            updateFood(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFood(this.form).then(response => {
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
      const foodIds = row.foodId || this.ids;
      this.$modal.confirm('是否确认删除一周订餐编号为"' + foodIds + '"的数据项？').then(function() {
        return delFood(foodIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bysj/food/export', {
        ...this.queryParams
      }, `food_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
