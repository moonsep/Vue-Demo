<template>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="教师编号" prop="teacherId" v-if=!isSH||!isUpdate>
          <el-input v-model="form.teacherId" placeholder="请输入填报教师编号" readonly />
        </el-form-item>
        <el-form-item label="紧急程度)" prop="urgency" v-if=!isSH||!isUpdate>
          <el-input v-model="form.urgency" placeholder="请输入紧急程度" readonly />
        </el-form-item>
        <el-form-item label="部门" prop="deptId" v-if=!isSH||!isUpdate>
          <el-input v-model="form.deptId" placeholder="请输入填报人部门" readonly />
        </el-form-item>
        <el-form-item label="填报时间" prop="submitTime" v-if=!isSH||!isUpdate>
          <el-date-picker clearable
            v-model="form.submitTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择填报时间" readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="离校人姓名" prop="leaverName" v-if=!isSH||!isUpdate>
          <el-input v-model="form.leaverName" placeholder="请输入离校人姓名" readonly />
        </el-form-item>
        <el-form-item label="离校人电话" prop="leaverPhone" v-if=!isSH||!isUpdate>
          <el-input v-model="form.leaverPhone" placeholder="请输入离校人电话" readonly />
        </el-form-item>
        <el-form-item label="离校人身份证号" prop="leaverId" v-if=!isSH||!isUpdate>
          <el-input v-model="form.leaverId" placeholder="请输入离校人身份证号" readonly />
        </el-form-item>
        <el-form-item label="离校时间" prop="outTime" v-if=!isSH||!isUpdate>
          <el-date-picker clearable
            v-model="form.outTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择离校时间" readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="返校时间" prop="backTime" v-if=!isSH||!isUpdate>
          <el-date-picker clearable
            v-model="form.backTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择返校时间" readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="目的地" prop="destination" v-if=!isSH||!isUpdate>
          <el-input v-model="form.destination" placeholder="请输入离校目的地" readonly />
        </el-form-item>
        <el-form-item label="交通方式" prop="transport" v-if=!isSH||!isUpdate>
          <el-input v-model="form.transport" placeholder="请输入交通方式" readonly />
        </el-form-item>
        <el-form-item label="离校人承诺确认" prop="promise" v-if=!isSH||!isUpdate>
          <el-input v-model="form.promise" placeholder="请输入离校人承诺确认(0已承诺 1未承诺)" readonly />
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
        <el-form-item label="备注" prop="remark" v-if=!isSH||!isUpdate>
          <el-input v-model="form.remark" placeholder="请输入备注" readonly />
        </el-form-item>
      </el-form>
</template>

<script>
import { getSchoolout } from '@/api/bysj/schoolout'

    export default{
        data(){
            return{
                form : {
                id: null,
                teacherId: null,
                urgency: null,
                deptId: null,
                submitTime: null,
                leaverName: null,
                leaverPhone: null,
                leaverId: null,
                outTime: null,
                backTime: null,
                destination: null,
                transport: null,
                promise: null,
                status: "0",
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null
      }
            }
        },
        created() {
            this.getList();
        },
        methods:{
            getList() {
                const id = this.$route.params && this.$route.params.id
             getSchoolout(id).then(response => {
                this.form = response.data;
      });
    },
        }
    }
</script>