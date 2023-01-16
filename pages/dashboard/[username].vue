<template>
  <div class="container mx-auto 2xl:w-3/5 xl:w-4/5 lg:w-9/10 w-11/12">
    <h1 @click="nice()" class="text-4xl font-bold text-center">Dashboard</h1>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const route = useRoute();
const passedUsername = route.params.username;
let user = ref(null);

onMounted(() => {
  console.log(route.params);
  findUser();
});

function nice() {
  console.log(passedUsername);
  console.log(route.params.username);
}

async function findUser() {
  console.log("Searching for user " + passedUsername);
  const { data: response } = await useFetch(config.public.apiBaseUrl, {
    query: {
      api_key: config.public.apiKey,
      format: "json",
      user: passedUsername,
      method: "user.getInfo",
    },
  });

  console.log(response.value);

  //if (!response.value) navigateTo("/");

  user.value = response.value.user;
}
</script>