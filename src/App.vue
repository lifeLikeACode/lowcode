<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #f5f6f7;
  min-height: 100vh;
  background: red;
}

.layout {
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  min-height: 100vh;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  transition: all 1s;
  background-color: #c1c1c1;
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 11px;
  height: 11px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8 !important;
}

::-webkit-scrollbar:hover {
  width: 11px;
  height: 11px;
}
</style>
