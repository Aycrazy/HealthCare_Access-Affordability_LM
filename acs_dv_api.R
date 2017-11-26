library('acs')
library(tidyverse)
library(readxl)
library(RSocrata)
library(data.table)
library(jsonlite)

setwd('~/Documents/data_viz/health_insurance_marketplace/')

update.packages("acs", clean=T)

Wisco_Counties_total_pop_2011 = acs.fetch(geography=geo.make(state="WI", county="*"), table.number="B01003", endyear=2011)

WI_Counties_med_inc = acs.fetch(geography=geo.make(state="WI", county="*"), table.number="B19013", endyear=2015) 
 
WI_Counties_med_names <- WI_Counties_med_inc@geography %>%
    mutate(NAME = gsub(" County, Wisconsin", "",NAME))

IN_Counties_med_inc = acs.fetch(geography=geo.make(state="IN", county="*"), table.number="B19013", endyear=2015)

IN_Counties_med_names <- IN_Counties_med_inc@geography %>%
    mutate(NAME = gsub(" County, Indiana", "",NAME))

IL_Counties_med_inc = acs.fetch(geography=geo.make(state="IL", county="*"), table.number="B19013", endyear=2015)

IL_Counties_med_names <- IL_Counties_med_inc@geography %>%
    mutate(NAME = gsub(" County, Illinois", "",NAME))

MI_Counties_med_inc = acs.fetch(geography=geo.make(state="MI", county="*"), table.number="B19013", endyear=2015)

MI_Counties_med_names <- MI_Counties_med_inc@geography %>%
    mutate(NAME = gsub(" County, Michigan", "",NAME))

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

cbind(WI_Counties_med_names,WI_Counties_med_inc@estimate)

median_income_2014 <- rbind(cbind(WI_Counties_med_names,WI_Counties_med_inc@estimate), 
                            cbind(IN_Counties_med_names,IN_Counties_med_inc@estimate),
                            cbind(IL_Counties_med_names,IL_Counties_med_inc@estimate),
                            cbind(MI_Counties_med_names,MI_Counties_med_inc@estimate)) %>%
                        mutate(state = gsub(55, 'Wisconsin', state)) %>%
                        mutate(state = gsub(18, 'Indiana', state)) %>%
                        mutate(state = gsub(17, 'Illinois', state)) %>%
                        mutate(state = gsub(26, 'Michigan',state))

WI_Counties_med_inc@geography %>%
    mutate(NAME = gsub(" County, Wisconsin", "",NAME))

left_join(uni_all_years, median_income_2014, by = (c('State' = 'state','County' = 'NAME')))

to_json <- subset(left_join(uni_all_years, median_income_2014, by = (c('State' = 'state','County' = 'NAME')))
       , !is.na(County)) %>%
    rename(median_income = B19013_001)

subset(left_join(uni_all_years, median_income_2014, by = (c('State' = 'state','County' = 'NAME')))
, !is.na(County)) %>%
    rename(median_income = B19013_001) %>%
    toJSON() %>%
    write_lines('~/Documents/uninsured_bump/bump_chart_data.json')

median_state_incomes <- as.data.frame(cbind(c('Wisconsin','Michigan','Illinois','Indiana'),
                    c(55638, 51084, 59588, 50532))) %>%
                    rename(State = V1, median_income = V2)

to_json<- uni_all_years %>%
    #mutate('% Uninsured' = gsub("\\%", "",'% Uninsured')) #%>%
    #mutate('% Uninsured' = as.numeric('% Uninsured')) #%>%
    rename(Uninsured = '% Uninsured') %>%
    group_by(State,year) %>%
    summarise( Uninsured = mean(Uninsured, na.rm = TRUE))

to_json <- left_join(to_json, median_state_incomes, by = 'State')

to_json %>%
    toJSON() %>%
    write_lines('~/Documents/uninsured_bump/bump_chart_state_data.json')


    

#uni_state_all_years %>%
#    toJSON() %>%
#    write_lines('~/Documents/uninsured_bump/bump_chart_data.json')

