<template>
     <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="编号" prop="receptionid">
          <el-input v-model="form.receptionid" placeholder="请输入编号"  disabled />
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-input v-model="form.applicant" placeholder="请输入申请人" readonly />
        </el-form-item>
        <el-form-item label="申请部门" prop="applicationDepartment">
          <el-input v-model="form.applicationDepartment" placeholder="请输入申请部门" readonly />
        </el-form-item>
        <el-form-item label="申请日期" prop="applicationDate">
          <el-date-picker clearable
            v-model="form.applicationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择申请日期"
            readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="来访单位" prop="visitingUnit">
          <el-input v-model="form.visitingUnit" placeholder="请输入来访单位" readonly />
        </el-form-item>
        <el-form-item label="来访人数" prop="visitingNumber">
          <el-input v-model="form.visitingNumber" placeholder="请输入来访人数" readonly />
        </el-form-item>
        <el-form-item label="领队姓名" prop="leaderName">
          <el-input v-model="form.leaderName" placeholder="请输入领队姓名" readonly />
        </el-form-item>
        <el-form-item label="领队职务" prop="leaderPosition">
          <el-input v-model="form.leaderPosition" placeholder="请输入领队职务" readonly />
        </el-form-item>
        <el-form-item label="领队电话" prop="leaderPhone">
          <el-input v-model="form.leaderPhone" placeholder="请输入领队电话" readonly />
        </el-form-item>
        <el-form-item label="来访原因" prop="visitingReason">
          <el-input v-model="form.visitingReason" placeholder="请输入来访原因" readonly />
        </el-form-item>
        <el-form-item label="用餐日期" prop="mealsDate">
          <el-date-picker clearable
            v-model="form.mealsDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择用餐日期"
            readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="陪餐人数" prop="withmealsNumber">
          <el-input v-model="form.withmealsNumber" placeholder="请输入陪餐人数" readonly />
        </el-form-item>
        <el-form-item label="陪餐人姓名" prop="withmealsName">
          <el-input v-model="form.withmealsName" placeholder="请输入陪餐人姓名" readonly />
        </el-form-item>
        <el-form-item label="开始时间" prop="overnightBegin">
          <el-date-picker clearable
            v-model="form.overnightBegin"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间"
            readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="overnightEnd">
          <el-date-picker clearable
            v-model="form.overnightEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="住宿说明" prop="overnightDemand">
          <el-input v-model="form.overnightDemand" placeholder="请输入住宿说明" readonly />
        </el-form-item>
        <el-form-item label="经费来源" prop="costSource">
          <el-input v-model="form.costSource" placeholder="请输入经费来源" readonly />
        </el-form-item>
        <el-form-item label="其他说明" prop="otherDemand">
          <el-input v-model="form.otherDemand" placeholder="请输入其他说明" readonly />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" readonly />
        </el-form-item>
    </el-form>

</template>
<script>
    import { getOfficial} from "@/api/bysj/official";

export default {
  name: "OfficialData",
  dicts: ['sys_normal_disable','shenghe_status'],
  data() {
    return {
      form :{
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
        mealsDate: null,
        mealsType: null,
        withmealsNumber: null,
        withmealsName: null,
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
      }
    };
  },
  created() {
   this.getInfo();
  },
  methods: {
    getInfo() {
      
      const id = this.$route.params && this.$route.params.id
      getOfficial(id).then(response => {
        this.form = response.data;
      });
    }
  }
}
</script>
