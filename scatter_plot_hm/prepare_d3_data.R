library(tidyverse)
library(readxl)
library(RSocrata)
library(data.table)
library(jsonlite)

setwd('~/Documents/data_viz/health_insurance_marketplace/')

sub_15<- read_xlsx('2015_OEP_County-Level_Public_Use_File.xlsx', sheet='(2) Financial Assistance')

aptc_16<- read_xlsx('County_Level_Demographics_2016.xlsx', sheet='APTC', skip = 2)

csr_16<- read_xlsx('County_Level_Demographics_2016.xlsx', sheet='CSR', skip = 2)

sub_17<- read_xlsx('2017_OEP_County-Level_Public_Use_File.xlsx', sheet='(2) Financial Assistance')

convert_cols = function (dframeslist){ldframes <- lapply(dframeslist,function(d){ 
    to_replace = colnames(d)
    replace_with = gsub(" ","_",tolower(colnames(d)))
    d <- setnames(d, c(to_replace), c(replace_with))
})}

#no need to have no aptc or not csr

convert_cols(list(sub_15,sub_17,csr_16,aptc_16))

sub_15 <- rename(sub_15, state_name = state)

sub_17 <- rename(sub_17, state_name = state)

sub_15 <- rename(sub_15, total_plan_selections = total_number_of_consumers_who_have_selected_a_marketplace_plan)
# 
aptc_16 <- rename(aptc_16, total_plan_selections = total_plan_selections)
# 
csr_16 <- rename(csr_16, total_plan_selections = total_plan_selections)
# 
sub_17 <- rename(sub_17, total_plan_selections = total_number_of_consumers_who_have_selected_a_marketplace_plan)

sub_15 <- rename(sub_15, yes_csr = consumers_with_csr)

sub_17 <- rename(sub_17, yes_csr = consumers_with_csr)

aptc_16 <- rename(aptc_16, yes_aptc = yes_aptc)

csr_16 <- rename(csr_16, yes_csr = yes_csr)

sub_15 <- rename(sub_15, yes_aptc = consumers_with_aptc)

sub_17 <- rename(sub_17, yes_aptc = consumers_with_aptc)


sub_15<-sub_15 %>%
    filter(state_name %in% c('IN','IL','MI','WI'))
sub_17<-sub_17 %>%
    filter(state_name %in% c('IN','IL','MI','WI'))
aptc_16<-aptc_16 %>%
    filter(state_name %in% c('IN','IL','MI','WI'))
csr_16<-csr_16 %>%
    filter(state_name %in% c('IN','IL','MI','WI'))

#all_years_15 <- left_join(sub_15, csr_16[c(1,2,4:6)], by = c('county_fips_code'))
sub_16 <- left_join(csr_16[c(1,3:5)], aptc_16[c(1,2,4:5)], by = c('county_fips_code')) 
#all_years <- left_join(all_years, sub_17[c(1,2,4:6)], by = c('county_fips_code'))

sub_15 <- sub_15 %>%
    mutate(yes_aptc = as.integer(yes_aptc)) %>%
    mutate(yes_csr = as.integer(yes_csr)) %>%
    mutate(no_aptc = total_plan_selections - yes_aptc) %>%
    mutate(no_csr = total_plan_selections - yes_csr)

sub_17[sub_17 == '*'] <- 0

sub_17 <- sub_17 %>%
    mutate(yes_aptc = as.integer(yes_aptc)) %>%
    mutate(yes_csr = as.integer(yes_csr)) %>%
    mutate(total_plan_selections = as.integer(total_plan_selections)) %>%
    mutate(no_aptc = total_plan_selections - yes_aptc) %>%
    mutate(no_csr = total_plan_selections - yes_csr)

metal_15<- read_xlsx('2015_OEP_County-Level_Public_Use_File.xlsx', sheet='(4) Metal Level')

metal_16<- read_xlsx('County_Level_Demographics_2016.xlsx', sheet='Metal Level', skip = 2)

metal_17<- read_xlsx('2017_OEP_County-Level_Public_Use_File.xlsx', sheet='(4) Metal Level')

convert_cols(list(metal_15,metal_17, metal_16))

metal_15 <- rename(metal_15, state_name = state)

metal_16 <- rename(metal_16, state_name = state)

metal_17 <- rename(metal_17, state_name = state)

metal_15<-metal_15 %>%
    filter(state_name %in% c('IN','IL','MI','WI'))

metal_17<-metal_17 %>%
    filter(state_name %in% c('IN','IL','MI','WI'))

metal_16<- metal_16 %>%
    filter(state_name %in% c('IN','IL','MI','WI'))


#get rid of total columsn for these

# to_replace_metal_16 = c(1,2,4:7)
# to_replace_metal_16 = colnames(metal_16[c(5:9)])
# replace_metal_16 = paste(colnames(metal_16[c(5:9)]),'16', sep= '_')
# metal_16<- setnames(metal_16[c(1,2,5:9)],to_replace_metal_16,replace_metal_16)
# metal_16[metal_16 == '*'] <- 0
# 
# to_replace_metal = c(1,2,5:8)
# 
# to_replace_metal_15 = colnames(metal_15[c(5:9)])
# replace_metal_15 = paste(colnames(metal_15[c(5:9)]),'15', sep= '_')
# metal_15<- setnames(metal_15[c(1,2,5:9)],to_replace_metal_15,replace_metal_15)
# metal_15[metal_15 == '*'] <- 0
# 
# to_replace_metal_17 = colnames(metal_17[c(5:9)])
# replace_metal_17 = paste(colnames(metal_17[c(5:9)]),'17', sep= '_')
# metal_17<- setnames(metal_17[c(1,2,5:9)],to_replace_metal_17,replace_metal_17)
# metal_17[metal_17 == '*'] <- 0

# all_years <- left_join(all_years, metal_15, by = c('state_name','county_fips_code'))
# all_years <- left_join(all_years, metal_16, by = c('state_name','county_fips_code'))
# all_years <- left_join(all_years, metal_17, by = c('state_name','county_fips_code'))

#could keep doing this to make the dataset completely comprehensive for our purposes
#but can focus on writing d3 code to create line chart

sub_by_state_2014_16 <- read.socrata(
    "https://data.cms.gov/resource/wgdz-db3f.json",
    app_token = 'tBydhQErvlkNXKA2PsFJsJ6kR',
    email     = "ayaspan@uchicago.edu",
    password  = "Metjetk5689!")

metal_by_state_2014_2016 <- read.socrata(
    "https://data.cms.gov/resource/ntkf-3xha.json",
    app_token = 'tBydhQErvlkNXKA2PsFJsJ6kR',
    email     = "ayaspan@uchicago.edu",
    password  = "Metjetk5689!")
                    

plan_attributes_14 <- read_csv('Plan_Attributes_PUF_14.csv')

rates_14 <- read_csv('Rate_PUF_14.csv')

service_area_14 <- read_csv('Service_Area_PUF_14.csv')

plan_attributes_15 <- read_csv('Plan_Attributes_PUF_15.csv')

service_area_15 <- read_csv('Service_Area_PUF_15.csv')

rates_15 <- read_csv('Rate_PUF_15.csv')

plan_attributes_16 <- read_csv('Plan_Attributes_PUF_16.csv')

rates_16 <- read_csv('Rate_PUF_16.csv')

service_area_16 <- read_csv('Service_Area_PUF_16.csv')

plan_attributes_17 <- read_csv('Plan_Attributes_PUF_17.csv')

rates_17 <- read_csv('Rate_PUF_17.csv')

service_area_17 <- read_csv('Service_Area_PUF_17.csv')

#filter states
convert_cols(list(plan_attributes_14,rates_14,plan_attributes_15,rates_15,
                  plan_attributes_16,rates_16,plan_attributes_17,rates_17,
                  service_area_14,service_area_15,service_area_16,service_area_17))

rates_14 <- rates_14 %>% filter(statecode %in% c('MI','WI','IL','IN'))

plan_attributes_14 <- plan_attributes_14 %>% filter(statecode %in% c('MI','WI','IL','IN'))

rates_15 <- rates_15 %>% filter(statecode %in% c('MI','WI','IL','IN'))

plan_attributes_15 <- plan_attributes_15 %>% filter(statecode %in% c('MI','WI','IL','IN'))

rates_16 <- rates_16 %>% filter(statecode %in% c('MI','WI','IL','IN'))

plan_attributes_16 <- plan_attributes_16 %>% filter(statecode %in% c('MI','WI','IL','IN'))

plan_attributes_17 <- plan_attributes_17 %>% filter(statecode %in% c('MI','WI','IL','IN'))

rates_17 <- rates_17 %>% filter(statecode %in% c('MI','WI','IL','IN'))

service_area_14 <- service_area_14 %>% filter(statecode %in% c('MI','WI','IL','IN'))

service_area_15 <- service_area_15 %>% filter(statecode %in% c('MI','WI','IL','IN'))

service_area_16 <- service_area_16 %>% filter(statecode %in% c('MI','WI','IL','IN'))

service_area_17 <- service_area_17 %>% filter(statecode %in% c('MI','WI','IL','IN'))

countyXrating_area <- read_csv('marketplace-data/ratingareas/CountyRAs.csv') %>%
    filter(state %in% c('Indiana','Illinois','Michigan','Wisconsin'))

#Average max out of pocket costs



#tabluate count of statewide plans which is needed to incorporate statewide into the
#average above
state_wide_counts <- table(service_individual_17$statecode)

#This is my attempt to use rates and rating areas to find mean price for 27 year old

#2014
rates_14 <- rates_14 %>%
    mutate(ratingarea = as.integer(substr(ratingareaid, 12,14))) %>%
    filter(age == 27)

ratesxcounties_14 <- left_join(rates_14, countyXrating_area[c('countyfip','ratingarea')], by = c('ratingarea')) %>%
    mutate(planid = substr(planid, 1, 14))

plan_attributes_14 <- plan_attributes_14 %>%
    filter(metallevel == 'Silver') %>%
    mutate(planid = substr(planid, 1, 14))

ratesxcounties_14<- left_join(plan_attributes_14, ratesxcounties_14, by = "planid")


premium_option_14 <- ratesxcounties_14 %>%
    group_by(countyfip) %>%
    #summarise(avg_silver_27_14 = mean(individualrate)) %>%
    summarise(avg_silver_27 = mean(individualrate)) %>%
    mutate(countyfip = as.character(countyfip))

#2015
rates_15 <- rates_15 %>%
    mutate(ratingarea = as.integer(substr(ratingareaid, 12,14))) %>%
    filter(age == 27)

ratesxcounties_15 <- left_join(rates_15, countyXrating_area[c('countyfip','ratingarea')], by = c('ratingarea')) %>%
    mutate(planid = substr(planid, 1, 14))

plan_attributes_15 <- plan_attributes_15 %>%
    filter(metallevel == 'Silver') %>%
    mutate(planid = substr(planid, 1, 14))

ratesxcounties_15<- left_join(plan_attributes_15, ratesxcounties_15, by = "planid")


premium_option_15 <- ratesxcounties_15 %>%
    group_by(countyfip) %>%
    #summarise(avg_silver_27_15 = mean(individualrate)) %>%
    summarise(avg_silver_27 = mean(individualrate)) %>%
    mutate(countyfip = as.character(countyfip))

#2016

rates_16 <- rates_16 %>%
    mutate(ratingarea = as.integer(substr(ratingareaid, 12,14))) %>%
    filter(age == 27)

ratesxcounties_16 <- left_join(rates_16, countyXrating_area[c('countyfip','ratingarea')], by = c('ratingarea')) %>%
    mutate(planid = substr(planid, 1, 14))

plan_attributes_16 <- plan_attributes_16 %>%
    filter(metallevel == 'Silver') %>%
    mutate(planid = substr(planid, 1, 14))

ratesxcounties_16 <- left_join(plan_attributes_16, ratesxcounties_16, by = "planid")


premium_option_16 <- ratesxcounties_16 %>%
    group_by(countyfip) %>%
    #summarise(avg_silver_27_16 = mean(individualrate)) %>%
    summarise(avg_silver_27 = mean(individualrate)) %>%
    mutate(countyfip = as.character(countyfip))

#2017

rates_17 <- rates_17 %>%
    mutate(ratingarea = as.integer(substr(ratingareaid, 12,14))) %>%
    filter(age == 27)

ratesxcounties_17 <- left_join(rates_17, countyXrating_area[c('countyfip','ratingarea')], by = c('ratingarea')) %>%
    mutate(planid = substr(planid, 1, 14))

plan_attributes_17 <- plan_attributes_17 %>%
    filter(metallevel == 'Silver') %>%
    mutate(planid = substr(planid, 1, 14))

ratesxcounties_17<- left_join(plan_attributes_17, ratesxcounties_17, by = "planid")


premium_option_17 <- ratesxcounties_17 %>%
    group_by(countyfip) %>%
    #summarise(avg_silver_27_17 = mean(individualrate)) %>%
    summarise(avg_silver_27 = mean(individualrate)) %>%
    mutate(countyfip = as.character(countyfip))

#add to all_years data

#all_years_14 <- left_join(all_years, premium_option_14[c('avg_silver_27_14','countyfip')], by =c('county_fips_code' = 'countyfip') )

all_years_15 <- left_join(sub_15, premium_option_15, by =c('county_fips_code' = 'countyfip') )

all_years_16 <- left_join(sub_16, premium_option_16, by =c('county_fips_code' = 'countyfip') )

all_years_17 <- left_join(sub_17[c(1:6,8:9)], premium_option_17, by =c('county_fips_code' = 'countyfip') )

#all_years_14 <- left_join(all_years, premium_option_14[c('avg_silver_27_14','countyfip')], by =c('county_fips_code' = 'countyfip') )

all_years_15 <- left_join(all_years_15, metal_15[c(1,5:9)], by = c('county_fips_code')) %>%
    mutate(platinum = 0) %>%
    mutate(year = '2015')

all_years_16 <- left_join(all_years_16, metal_16[c(1,4:9)], by = c('county_fips_code'))%>%
    mutate(year = '2016')

all_years_17 <- left_join(all_years_17, metal_17[c(1,5:9)], by = c('county_fips_code')) %>%
    mutate(year = '2017')
   


all_years_15[all_years_15 == '*'] <- 0

all_years_16[all_years_16 == '*'] <- 0

all_years_17[all_years_17 == '*'] <- 0

all_years <- rbind(all_years_15,all_years_16,all_years_17) %>%
    mutate(yes_csr = as.integer(yes_csr)) %>%
    mutate(yes_aptc = as.integer(yes_aptc))

View(subset(all_years,total_plan_selections == 0))

    
#add year columns

write_csv(all_years,'scatter_area_data.csv')

all_years %>%
    toJSON() %>%
    write_lines('~/Documents/scatter_plot_hm/scatter_area_data.json')
