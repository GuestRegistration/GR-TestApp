
  import firebase from './../firebase'

export default {
    /**
     * Translate a timestamp to human readable time
     */
    resolveTimestamp: (timestamp) => {
        timestamp = parseInt(timestamp)

        let date = new Date((timestamp));
        let now = new Date();
        let seconds_difference = now.getTime() - date.getTime();
        let diff = '';
        if(seconds_difference > 604800000){
          diff = Math.floor(seconds_difference/604800000)+'w'; // estimate in weeks
        }else if(seconds_difference > 86400000){
          diff = Math.floor(seconds_difference/86400000)+'d'; // estimate in days
        }else if(seconds_difference > 3600000){
          diff = Math.floor(seconds_difference/3600000)+'h'; // estimate in hours
        }else if(seconds_difference > 60000){
          diff = Math.floor(seconds_difference/60000)+'m'; // estimate in minutes
        }else{
          diff = Math.floor(seconds_difference/1000)+'s' //estimate in seconds
        }
        return `${date.toDateString()}, ${diff} ago`
    },

    nowTimestamp: () => {
      let now = new Date();
      return Math.floor(now.getTime()/1000);
    }
}