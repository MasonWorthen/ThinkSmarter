$(document).ready(function(){
 
    function renderPieChart(data,labels,label,element,container){
        $(`#${element}`).remove();
        $(container).append($(`<div class="col-md-4 m-3" style="height:300px; width:300px;"> <canvas id="${element}"></canvas></div>`))
        const ctx = $(`#${element}`);
       
        const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels:labels,
            datasets: [{
              data: data,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
        }    
    });
}
 
    function renderBarChart(data,labels,label,element,container){
        $(`#${element}`).remove();
        $(container).append($(`<div class="col-md-4 m-3" style="height:300px; width:300px;"> <canvas id="${element}"></canvas></div>`))
        const ctx = $(`#${element}`);
       
        const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels:labels,
            datasets: [{
              data: data,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
        }    
    });
}
 
 
    renderPieChart([$('.male').text(),$('.female').text(),$('.other').text()], ['Male','Female','Other'],"Gender Group Improvement","myChart",".graphs");
    renderPieChart([20,50,20], ['Male','Female','Other'],"Gender Group Improvement","myChart1",".graphs");
    renderBarChart([$('.critical').text(),$('.memory').text(),$('.decide').text()], ['Memorization','CIT','DMS'],"Gender Group Improvement","myChart3",".graphs");
 
 
  });

