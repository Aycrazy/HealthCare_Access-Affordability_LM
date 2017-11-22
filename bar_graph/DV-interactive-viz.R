

library(jsonlite)
library(tidyverse)
library(httr)
library(plyr)
library(dplyr)
library(reshape2)
library(RJSONIO)
library(rmarkdown)

# 2013 data only
compile131415 <- read_csv("C:\\Users\\Alix\ Gates\\Documents\\UChicago\\Data\ Visualization\\Git\ Hub\ Repo\\CountyHealthRankings\\compiled_county_health_rankings_131415.csv")

# aggregate health status and population over 18
hs_compile131415 <- aggregate(health_status ~ range_income, compile131415, median)
pop_compile131415 <- aggregate(num_18plus ~ range_income, compile131415, sum)

# join heath status and population over 18 dfs
agg_comp <- join(hs_compile131415, pop_compile131415)

# write the json
write_json(agg_comp, "C:\\Users\\Alix\ Gates\\Documents\\GitHub\\group_project\\HealthCare_Access-Affordability_LM\\bar_graph_data2.json")

# 2013, 2014, and 2015 data
countyhealthinfo <- read_csv("C:\\Users\\Alix\ Gates\\Documents\\UChicago\\Data\ Visualization\\Git\ Hub\ Repo\\CountyHealthRankings\\countyhealthinfo.csv")

# aggregate health status and population over 18
hs_countyhealthinfo <- aggregate(health_status ~ range_income + year + state, countyhealthinfo, median)
pop_countyhealthinfo <- aggregate(num_18plus ~ range_income + year + state, countyhealthinfo, sum)

hs_statelevel <- aggregate(health_status ~ range_income + year, countyhealthinfo, median)
pop_statelevel <- aggregate(num_18plus ~ range_income + year, countyhealthinfo, sum)

# join heath status and population over 18 dfs
countyhealthinfo_overallagg <- join(hs_statelevel, pop_statelevel)
countyhealthinfo_overallagg$state <- "all"
countyhealthinfo_aj <- join(hs_countyhealthinfo, pop_countyhealthinfo)
countyhealthinfo_overallandstate <- bind_rows(countyhealthinfo_aj, countyhealthinfo_overallagg)

# write the json
write_json(countyhealthinfo_overallandstate, "C:\\Users\\Alix\ Gates\\Documents\\GitHub\\group_project\\HealthCare_Access-Affordability_LM\\bar_graph_data.json")
