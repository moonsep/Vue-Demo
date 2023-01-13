<template>
  <div class="app-container">
     <el-form ref="form" :model="form" label-width="80px">
       <el-row>
         <el-col :span="15">
         <el-form-item label="紧急程度" prop="urgency">
           <el-radio-group v-model="form.urgency" disabled>
               <el-radio
                 v-for="dict in dict.type.bysj_urgency"
                 :key="dict.value"
                 :label="dict.value"
               >{{dict.label}}</el-radio>
             </el-radio-group>
           </el-form-item>
          </el-col>
        <el-col :span="15">
           <el-form-item label="申请人" prop="createBy">
             <el-input v-model="form.createBy" placeholder="请输入申请人" readonly="true"/>
           </el-form-item>
         </el-col>
         <el-col :span="15">
          <el-form-item label="申请时间" prop="applicationTime">
            <el-date-picker clearable disabled
              v-model="form.applicationTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择申请时间">
            </el-date-picker>
          </el-form-item>
         </el-col>
         <el-col :span="15">
          <el-form-item label="申请部门" prop="departmentId">
            <el-select v-model="form.departmentId" placeholder="请选择所属系部" clearable disabled>
              <el-option
                v-for="item in departmentList"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId"
              />
            </el-select>
          </el-form-item>
         </el-col>
         <el-col :span="15">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入联系电话" readonly="true"/>
          </el-form-item>
         </el-col>
         <!-- <el-form-item label="用户编号" prop="userid">
           <el-input v-model="form.userid" placeholder="请输入用户编号" />
         </el-form-item> -->
         <el-col :span="15">
          <el-form-item label="开始时间" prop="start">
            <el-date-picker clearable disabled
              v-model="form.start"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择开始时间">
            </el-date-picker>
          </el-form-item>
         </el-col>
         <el-col :span="15">
          <el-form-item label="出行人数" prop="number">
            <el-input v-model="form.number" placeholder="请输入出行人数" readonly="true"/>
          </el-form-item>
         </el-col>
         <el-col :span="15">
           <el-form-item label="目的地" prop="destination">
             <el-input v-model="form.destination" placeholder="请输入目的地" readonly="true"/>
           </el-form-item>
         </el-col>
         <el-col :span="15">
           <el-form-item label="乘车地点" prop="place">
             <el-input v-model="form.place" placeholder="请输入乘车地点" readonly="true"/>
           </el-form-item>
         </el-col>
         <el-col :span="15">
          <el-form-item label="用车需求补充说明" prop="additional">
            <el-input v-model="form.additional" placeholder="请输入用车需求补充说明" readonly="true"/>
          </el-form-item>
         </el-col>
         <el-col :span="15">
         <el-form-item label="用车性质" prop="useCar">
           <el-select v-model="form.useCar" placeholder="请选择用车性质" @change="modChange" clearable disabled>
             <el-option
               v-for="dict in dict.type.bysj_ycxz"
               :key="dict.value"
               :label="dict.label"
               :value="dict.value"
             />
           </el-select>
         </el-form-item>
         </el-col>
         <el-col :span="15">
          <el-form-item label="教师用车类型"  prop="teacherCar">
            <el-select v-model="form.teacherCar" placeholder="请选择教师用车类型" clearable disabled>
              <el-option
                v-for="dict in dict.type.bysj_teachercar"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
         </el-col>
         <el-col :span="15">
          <el-form-item label="学生类用车类型"  prop="studentCar" >
              <el-select v-model="form.studentCar" placeholder="请选择学生类用车类型" clearable disabled>
                <el-option
                  v-for="dict in dict.type.bysj_studentcar"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
          </el-form-item>
         </el-col>
         <el-col :span="15">
         <el-form-item label="带队教师" prop="teacherId">
           <el-input v-model="form.teacherId" placeholder="请输入带队教师" readonly="true"/>
         </el-form-item>
         </el-col>
         <el-col :span="15">
         <el-form-item label="备注信息" prop="remark">
           <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" readonly="true"/>
         </el-form-item>
         </el-col>
         <el-col :span="15">
        <el-form-item label="审核状态" prop="status">
          <el-radio-group v-model="form.status" disabled>
              <el-radio
                v-for="dict in dict.type.shenhe_status"
                :key="dict.value"
                :label="dict.value"
              >{{dict.label}}</el-radio>
            </el-radio-group>
        </el-form-item>
         </el-col>
      </el-row>
     </el-form>
     </div>
</template>

<script>
import { getbysjCarorder } from "@/api/bysj/bysjcarorder";

export default {
  name: "CanteenorderData",
  dicts:['bysj_urgency','shenhe_status','bysj_ycxz','bysj_teachercar','bysj_studentcar'],
  data() {
    return {
      // 表单参数
      form: {
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
      }
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    /** 查询会议室列表 */
    getInfo() {
     const carorderId = this.$route.params && this.$route.params.carorderId
     getbysjCarorder(carorderId).then(response => {
       this.form = response.data;
      });
    }
  }
};
</script>
