<script lang="ts">
  export let data;
</script>

<h2>Plugin test 1</h2>

<h3>Test 1</h3>
<p>Should be: "Hello, world!"</p>
<p>Is: {JSON.stringify(data.pluginTestResults.hello)}</p>

<h3>Test 2</h3>
<p>Should be: "Hello, NeoKit!"</p>
<p>Is: {JSON.stringify(data.pluginTestResults.neokit)}</p>

<h2>Plugin test 2</h2>

<h3>Test 1</h3>
<p>Should be: "everything is fine"</p>
<p>Is: {JSON.stringify(data.pluginTest2Results)}</p>

<h2>Plugin test 3</h2>

<h3>Test 1</h3>
<p>Should be: "Error: Plugin dev.neokit.example3 requires plugin dev.neokit.example3"</p>
<p>Is: {JSON.stringify(data.pluginTest3Results)}</p>

<h2>Plugin test 4</h2>

<h3>Test 1</h3>
<p>Should be: "Error: This plugin is not compatible with this version of NeoKit. Expected Plugin API version between 1 and 1, got 0"</p>
<p>Is: {JSON.stringify(data.pluginTest4Results)}</p>