<template>
  <div>
    <p>{{ msg }}</p>

    <ul>
      <li v-for="(item, i) in list" :key="i">
        {{ item }}
      </li>
    </ul>
    <ul>
      <li v-for="(item, i) in readonlyList" :key="i">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Wepy means "Winter" in icelandic.',
      list: [0, 1, 2],
      readonlyList: ['foo', 'bar'] as Readonly<string[]>
    }
  }
}
</script>
