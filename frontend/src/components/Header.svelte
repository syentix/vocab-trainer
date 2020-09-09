<script lang="ts">
  let loggedIn = false;

  const login = () => {
    loggedIn = !loggedIn;
  };
</script>

<style lang="postcss">
  .btn {
    @apply py-1 px-2 border-red-400 rounded;
  }
  .btn-login {
    @apply bg-green-500 text-white;
  }
  .btn-login:hover {
    @apply bg-green-700;
  }

  .btn-register {
    @apply bg-yellow-500 text-white;
  }
  .btn-register:hover {
    @apply bg-yellow-700;
  }

  .btn-logout {
    @apply bg-red-500 text-white;
  }
  .btn-logout:hover {
    @apply bg-red-700;
  }

  #title:hover {
    @apply text-red-900 no-underline;
  }
</style>

<header class="bg-red-500 flex flex-wrap items-center justify-between p-6">
  <div />
  <div class="text-center">
    <a
      id="title"
      class="text-red-800 text-2xl font-bold no-underline"
      href="#">Nihongo Trainer</a>
  </div>
  <div>
    <ul class="flex">
      {#if loggedIn}
        <li class="mr-2 flex-1">
          <button on:click={login} class="btn btn-logout w-20"> Logout </button>
        </li>
      {:else}
        <li class="mr-2 flex-1">
          <button on:click={login} class="btn btn-login w-20"> Login </button>
        </li>
        <li class="mr-2 flex-1">
          <button class="btn btn-register w-20"> Register </button>
        </li>
      {/if}
    </ul>
  </div>
</header>
