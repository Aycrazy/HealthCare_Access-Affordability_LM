library('acs')
library(tidyverse)
library(readxl)
library(RSocrata)
library(data.table)
library(jsonlite)

setwd('~/Documents/data_viz/health_insurance_marketplace/')

update.packages("acs", clean=T)

Wisco_Counties_total_pop_2011 = acs.fetch(geography=geo.make(state="WI", county="*"), table.number="B01003", endyear=2011)

missing_county_WI = acs.fetch(geography=geo.make(state="WI", fips="17000"), table.number="B01003", endyear=2011)

missing_county_MI = acs.fetch(geography=geo.make(state="MI", fips="18000"), table.number="B01003", endyear=2011)

missing_county_IN = acs.fetch(geography=geo.make(state="IN", fips="26000"), table.number="B01003", endyear=2011)

missing_county_IL = acs.fetch(geography=geo.make(state="IL", fips="55000"), table.number="B01003", endyear=2011)


ui_10<- read_xls('2010 County health Rankings National Data.xls', sheet='Ranked Measure Data', skip = 1) %>%
    select(c('State','County', 'FIPS','% Uninsured')) %>%
    filter( State %in% c('Indiana','Illinois','Wisconsin','Michigan'))%>%
    mutate(year = 2010)
           
ui_11<- read_xls('2011 County health Rankings National Data.xls', sheet='Ranked Measure Data', skip = 1) %>%
    select(c('State','County', 'FIPS','% Uninsured')) %>%
    filter( State %in% c('Indiana','Illinois','Wisconsin','Michigan'))%>%
    mutate(year = 2011)
    
ui_12<- read_xls('2012 County health Rankings National Data.xls', sheet='Ranked Measure Data', skip = 1) %>%
    select(c('State','County', 'FIPS','% Uninsured')) %>%
    filter( State %in% c('Indiana','Illinois','Wisconsin','Michigan'))%>%
    mutate(year = 2012)
    
ui_13<- read_xls('2013CountyHealthRankingsNationalData.xls', sheet='Ranked Measure Data', skip = 1) %>%
    select(c('State','County', 'FIPS','% Uninsured')) %>%
    filter( State %in% c('Indiana','Illinois','Wisconsin','Michigan'))%>%
    mutate(year = 2013)
    
ui_14<- read_xls('2014 County health Rankings Data.xls', sheet='Ranked Measure Data', skip = 1) %>%
    select(c('State','County', 'FIPS','% Uninsured')) %>%
    filter( State %in% c('Indiana','Illinois','Wisconsin','Michigan'))%>%
    mutate(year = 2014)
    
ui_15<- read_xls('2015 County health Rankings Data.xls', sheet='Ranked Measure Data', skip = 1) %>%
    select(c('State','County', 'FIPS','% Uninsured')) %>%
    filter( State %in% c('Indiana','Illinois','Wisconsin','Michigan'))%>%
    mutate(year = 2015)
    
ui_16<- read_xls('2016 County health Rankings Data.xls', sheet='Ranked Measure Data', skip = 1) %>%
    select(c('State','County', 'FIPS','% Uninsured')) %>%
    filter( State %in% c('Indiana','Illinois','Wisconsin','Michigan'))%>%
    mutate(year = 2016)
    
ui_17<- read_xls('2017CountyHealthRankingsData.xls', sheet='Ranked Measure Data', skip = 1) %>%
    select(c('State','County', 'FIPS','% Uninsured')) %>%
    filter( State %in% c('Indiana','Illinois','Wisconsin','Michigan'))%>%
    mutate(year = 2017)

uni_all_years <- rbind(ui_10, ui_11, ui_12, ui_13, ui_14, ui_15, ui_16, ui_17)

subset(uni_all_years, !is.na(County)) %>%
    toJSON() %>%
    write_lines('~/Documents/uninsured_bump/bump_chart_data.json')

uni_state_all_years <- uni_all_years %>%
    #mutate('% Uninsured' = gsub("\\%", "",'% Uninsured')) #%>%
    #mutate('% Uninsured' = as.numeric('% Uninsured')) #%>%
    rename(Uninsured = '% Uninsured') %>%
    group_by(State,year) %>%
    summarise( Uninsured = mean(Uninsured, na.rm = TRUE))

#uni_state_all_years %>%
#    toJSON() %>%
#    write_lines('~/Documents/uninsured_bump/bump_chart_data.json')

