<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

// These values hold what the user types into the form.
const employee = reactive({
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  profilePhotoUrl: ''
})

// Temporarily check whether the form captures our values.
function showDetails() {
  console.log({ ...employee })

  ElMessage.success('Form data printed in the browser console')
}
</script>

<template>
  <div class="add-employee-page">
    <h1>Add Employee</h1>
    <p class="subtitle">Enter the employee's basic details.</p>

    <el-card class="form-card">
      <h2>1. Basic Details</h2>

      <el-form :model="employee" label-position="top">
        <el-row :gutter="20">
          <!-- First Name -->
          <el-col :span="8">
            <el-form-item label="First Name">
              <el-input
                v-model="employee.firstName"
                placeholder="Enter first name"
              />
            </el-form-item>
          </el-col>

          <!-- Middle Name -->
          <el-col :span="8">
            <el-form-item label="Middle Name">
              <el-input
                v-model="employee.middleName"
                placeholder="Enter middle name"
              />
            </el-form-item>
          </el-col>

          <!-- Last Name -->
          <el-col :span="8">
            <el-form-item label="Last Name">
              <el-input
                v-model="employee.lastName"
                placeholder="Enter last name"
              />
            </el-form-item>
          </el-col>

          <!-- Date of Birth -->
          <el-col :span="12">
            <el-form-item label="Date of Birth">
              <el-date-picker
                v-model="employee.dateOfBirth"
                type="date"
                placeholder="Select date of birth"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- Gender -->
          <el-col :span="12">
            <el-form-item label="Gender">
              <el-select
                v-model="employee.gender"
                placeholder="Select gender"
                style="width: 100%"
              >
                <el-option label="Male" value="Male" />
                <el-option label="Female" value="Female" />
                <el-option label="Other" value="Other" />
                <el-option
                  label="Prefer not to say"
                  value="Prefer not to say"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Profile Photo URL -->
          <el-col :span="24">
            <el-form-item label="Profile Photo URL">
              <el-input
                v-model="employee.profilePhotoUrl"
                placeholder="Paste the employee photo URL"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- Temporary button for testing -->
    <el-button type="primary" @click="showDetails">
      Check Form Data
    </el-button>
  </div>
</template>


<style scoped>
.add-employee-page {
  padding: 24px;
}

.subtitle {
  color: #777;
  margin-bottom: 24px;
}

.form-card {
  margin-bottom: 24px;
}

h1 {
  margin-bottom: 8px;
}

h2 {
  margin-top: 0;
  margin-bottom: 24px;
}
</style>