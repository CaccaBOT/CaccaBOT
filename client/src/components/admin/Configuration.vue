<script setup lang="ts">
import { ref } from 'vue'

//@ts-ignore
const timezones = Intl.supportedValuesOf('timeZone')
const config = ref({
  serverUrl: null,
  groupId: null,
  timezone: null
})

function autoDetect() {
  config.value.serverUrl = `${window.location.protocol}//${window.location.href.split('/').slice(1, 3).join('')}`
  config.value.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
}

function save() {
  //TODO: implement API call
}
</script>

<template>
  <div class="configuration-wrapper">
    <div class="section prose m-2 rounded-2xl bg-base-200 p-5 text-center">
      <h1 class="mb-2">Configuration</h1>
      <div class="not-prose p-6">
        <form class="form-control" @submit.prevent="() => { }">
          <fieldset class="fieldset">
            <label class="label" for="serverUrl">Server URL</label>
            <input id="serverUrl" v-model="config.serverUrl" type="text" placeholder="https://yourinstance.dev"
              class="input" required />
          </fieldset>
          <fieldset class="fieldset">
            <label class="label" for="groupId">Group ID</label>
            <input id="groupId" v-model="config.groupId" type="text" placeholder="123456789012345678@g.us" class="input"
              required />
          </fieldset>
          <fieldset class="fieldset">
            <label class="label" for="timezone">Server Timezone</label>
            <select id="timezone" v-model="config.timezone" required class="select">
              <option disabled selected>Select a timezone</option>
              <option v-for="timezone in timezones" :key="timezone">{{ timezone }}</option>
            </select>
          </fieldset>
          <div class="divider"></div>
          <div class="join mt-8 w-96">
            <button @click="autoDetect()" class="btn join-item btn-primary">Auto-Detect</button>
            <button @click="save()" class="btn join-item btn-success">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
