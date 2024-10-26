<script setup lang="ts">
import { ref } from 'vue';

//@ts-ignore
const timezones = Intl.supportedValuesOf('timeZone')
const config = ref({
    prefix: null,
	serverUrl: null,
    groupId: null,
	whatsappModuleEnabled: false,
	monthlyPurge: false,
	timezone: null,
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
        <div class="section m-2 rounded-2xl bg-base-200 p-5 prose text-center">
            <h1 class="mb-2">Configuration</h1>
            <div class="not-prose p-6">
                <form class="form-control" @submit.prevent="() => {}">
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">BOT Prefix</span>
                        </div>
                        <input v-model="config.prefix" type="text" placeholder="cacca" class="input input-bordered" required />
                    </label>
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Server URL</span>
                        </div>
                        <input v-model="config.serverUrl" type="text" placeholder="https://yourinstance.dev" class="input input-bordered" required />
                    </label>
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Group ID</span>
                        </div>
                        <input v-model="config.groupId" type="text" placeholder="123456789012345678@g.us" class="input input-bordered" required />
                    </label>
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Server Timezone</span>
                        </div>
                        <select v-model="config.timezone" required class="select select-bordered">
                            <option disabled selected>Select a timezone</option>
                            <option v-for="timezone in timezones">{{ timezone }}</option>
                        </select>
                    </label>
                    <div class="divider"></div>
                    <label class="label cursor-pointer">
                        <span class="label-text text-lg">Whatsapp Module</span>
                        <input v-model="config.whatsappModuleEnabled" type="checkbox" class="toggle toggle-success" />
                    </label>
                    <label class="label cursor-pointer">
                        <span class="label-text text-lg">Monthly Purge</span>
                        <input v-model="config.monthlyPurge" type="checkbox" class="toggle toggle-success" />
                    </label>
                    <button @click="autoDetect()" class="btn btn-primary w-96 mt-8">Auto-Detect</button>
                    <button @click="save()" class="btn btn-success w-96 mt-2">Save</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
