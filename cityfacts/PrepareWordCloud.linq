<Query Kind="Statements" />

var text = File.ReadAllText(Path.Combine(Path.GetDirectoryName(Util.CurrentQueryPath), "kapstadt.txt"));

var ignoreWords = "der;die;das;des;und;in;zu;sie;er;es;von;ist;wird;auf;ein;eine;einer;einem;den;wie;an;mit;aus;nach;ich;im;sich;vor;nicht;nur;für;dem;am;ihr;ihre;mich;um;auch".Split(';');


var regexSplitWords = new Regex("\\p{L}+");
var words = regexSplitWords.Matches(text).Where(m => m.Success).Select(m => m.Value);
words = words.Where(w => !ignoreWords.Any(i => i.Equals(w, StringComparison.OrdinalIgnoreCase))); 
var wordGroups = words.GroupBy(m => m).Select(g => new { Word = g.Key, Count = g.Count() }).OrderByDescending(w => w.Count).Dump();