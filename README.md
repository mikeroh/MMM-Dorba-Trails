# MMM-Dorba-Trails
A Simple Module for MagicMirror2 designed to parse Dorba Mountain Bike Trail status.

The actual trail status comes from the site trailforks.com

The module is named after the Dallas Off Road Bike Association, which has introduced me to a ton of
trails around the Dallas-Ft Worth area.

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation
  1. Clone repo into MagicMirror/modules directory
        cd ~/MagicMirror/modules
        git clone https://github.com/drventure/MMM-Dorba-Trails.git
  2. Create an entry in 'config/config.js' with the trails you want to monitor

 **Example:**
```
{                                                                                                                                                                                                                             
    module: 'MMM-Dorba-Trails',                                                                                                                                                                                               
    position: 'top_center',                                                                                                                                                                                                   
    config: {                                                                                                                                                                                                                 
        url: "https://www.trailforks.com/widgets/trails_status/?rid={regionId}&displaytype=table&cols=difficulty,title,status,last_report_ts,condition",
        regionID: "4697",
        trails: ["devonian-drop","prospector-10615","razors-edge","reclaimer"],
    }
},
```
regionID is an identifier for an area.
trails is a comma delimited list of trail names from the trailforks.com trail guide website.

To find a regionID: 

Go to trailforks.com
Search for your region, example: https://www.trailforks.com/region/bow-valley/
Once you find the area you're interested in, "View Page Source" in your browser.
Search for the text "?rid=" (without the quotes)
You should find an instance of a line that looks something like this:

https://www.trailforks.com/contribute/trail/?rid=4697

The 4697 is the regionID.

Next go to https://www.trailforks.com/widgets/trails_status/?rid=4697&displaytype=table&cols=difficulty,title,status,last_report_ts,condition but substituting in your regionID instead of 4697.
There will be a list of valid trails, find the ones you are interested in, and the names will be links.
Example: https://www.trailforks.com/trails/prospector-10615/

Take the name of trail in the url after the `/trails/` to get a trail name to put in your list of trails. In this case it will be `prospector-10615`.


## Sample
![alt text](https://github.com/mikeroh/MMM-Dorba-Trails/blob/trails_status/example.jpeg "Example")


## Optional Config
| **Option** | **Description** |
| --- | --- |
| none | None at this time |

