<script lang="ts">
  import Header from './components/Header.svelte';
</script>

<style global lang="postcss">
  /* only apply purgecss on utilities, per Tailwind docs */
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;

  /* Bring in Montserrat */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

  body {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
  }
</style>

<Header />
