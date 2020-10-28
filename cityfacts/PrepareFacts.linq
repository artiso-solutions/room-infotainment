<Query Kind="Statements">
  <NuGetReference Prerelease="true">Genbox.WolframAlpha</NuGetReference>
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>Genbox.WolframAlpha</Namespace>
  <Namespace>Genbox.WolframAlpha.Objects</Namespace>
  <Namespace>Genbox.WolframAlpha.Responses</Namespace>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

WolframAlphaClient client = new WolframAlphaClient("T6X4XL-RXUGV2XRUP");

//We start a new query.
FullResultResponse results = await client.FullResultAsync("Kapstadt");
var idsToIgnore = new[] { "Location:CityMap", "Map:CityData", "PopularityPod:WikipediaStatsData" };

var information = results.Pods.Select(p => new { p.Id, p.Title, Text = p.SubPods.FirstOrDefault(s => !string.IsNullOrEmpty(s.Plaintext))?.Plaintext })
.Where(i => !idsToIgnore.Contains(i.Id));

var output = JsonConvert.SerializeObject(information, Newtonsoft.Json.Formatting.Indented);
output.Dump();

File.WriteAllText(Path.Combine(Path.GetDirectoryName(Util.CurrentQueryPath), "kapstadt.json"), output);