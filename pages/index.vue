<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-2">
      Hey! Welcome to <span class="text-primary">Racing Scrobbles</span>.
    </h1>
    <p class="mb-10">
      This page can be used to create some fancy music graphs. Enter your
      Last.FM user name to get started:
    </p>
    <form v-if="!user">
      <input
        type="text"
        placeholder="Your Last.FM username"
        class="input input-bordered input-primary w-full max-w-xs mr-2"
        v-model="username"
        required
      />
      <button class="btn btn-primary" type="submit" @click.prevent="findUser()">
        Find user
      </button>
    </form>
    <p v-if="loading">Loading user...</p>
    <article v-if="user" class="mb-5">
      <div class="flex justify-center mb-2">
        <img
          class="rounded-full"
          :src="user.image[1]['#text']"
          :alt="`Profile picture of ${user.name}`"
        />
      </div>
      <h2 class="text-2xl font-bold">{{ user.name }}</h2>
      <p>
        {{ user.playcount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}
        Scrobbles
      </p>
    </article>
    <form v-if="user" class="flex justify-center gap-2">
      <NuxtLink :to="`/dashboard/${user.name}`"
        ><button class="btn btn-primary">Continue</button></NuxtLink
      >
      <button class="btn" @click="user = null">Change user</button>
    </form>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

let username = ref("");
let loading = ref(false);
const tracks = ref([]);
let currentPage = ref("-");
let totalPages = ref("-");
let user = ref(null);

async function findUser() {
  loading.value = true;

  const { data: response } = await useFetch(config.public.apiBaseUrl, {
    query: {
      api_key: config.public.apiKey,
      format: "json",
      user: username,
      method: "user.getInfo",
    },
  });

  loading.value = false;

  user.value = response.value.user;
}

async function loadDataForUsername() {
  tracks.value.length = 0;

  const options = {
    query: {
      api_key: config.public.apiKey,
      format: "json",
      method: "user.getrecenttracks",
      limit: 1000,
      page: 0,
      user: username,
    },
  };

  loading.value = true;
  do {
    options.query.page++;

    const { data: lastFmResponse } = await useFetch(
      config.public.apiBaseUrl,
      options
    );

    const meta = lastFmResponse.value.recenttracks["@attr"];
    currentPage.value = parseInt(meta.page);
    totalPages.value = parseInt(meta.totalPages);

    const tracksOnPage = lastFmResponse.value.recenttracks.track;
    tracks.value.push(...tracksOnPage);
  } while (currentPage < totalPages);
  loading.value = false;
}
</script>