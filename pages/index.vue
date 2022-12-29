<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-2">
      Hey! Welcome to <span class="text-primary">Racing Scrobbles</span>.
    </h1>
    <p class="mb-10">
      This page can be used to create some fancy music graphs. Enter your
      Last.FM user name to get started:
    </p>
    <form>
      <input
        type="text"
        placeholder="Your Last.FM username"
        class="input input-bordered input-primary w-full max-w-xs mr-2"
        v-model="username"
        required
      />
      <button
        class="btn btn-primary"
        type="submit"
        @click.prevent="loadDataForUsername()"
      >
        Go4it
      </button>
    </form>
    <p v-if="loading">
      Loading data for user {{ username }}... Page {{ displayedCurrentPage }} of
      {{ totalPages }}
    </p>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

let username = ref("");
let loading = ref(false);
const tracks = ref([]);
let displayedCurrentPage = ref(1);
let totalPages = ref("-");

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

  let meta;
  do {
    options.query.page++;
    loading.value = true;

    const { data: lastFmResponse } = await useFetch(
      config.public.apiBaseUrl,
      options
    );

    meta = lastFmResponse.value.recenttracks["@attr"];
    meta.page = parseInt(meta.page);
    meta.totalPages = parseInt(meta.totalPages);

    displayedCurrentPage.value = meta.page;
    totalPages.value = meta.totalPages;

    const tracksOnPage = lastFmResponse.value.recenttracks.track;
    tracks.value.push(...tracksOnPage);
    loading.value = false;
  } while (meta.page <= meta.totalPages);
}
</script>