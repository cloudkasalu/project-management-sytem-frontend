// Sidebar toggle button

const projectDOM = document.querySelector('.project-details');
const milestoneDOM = document.querySelector('.milestones-list');
const addMilestoneDOM = document.querySelector('.add-milestone-link');
const tasksDOM = document.querySelector('.tasks-list');
const addTaskDOM = document.querySelector('.add-task-link')

// Assuming the URL is: https://example.com/?var1=value1&var2=value2

// Get the search parameters from the current URL
const urlParams = new URLSearchParams(window.location.search);

// Get the value of a specific variable
const var1Value = urlParams.get('id');
console.log(var1Value); // Output: "value1"


const data = async () => {
  try{
      let response =  await fetch(
          `/js/project.json`

      )
    
      let data = await response.json();

      const project = {
        'project_id': data[0].project_id,
        'project_name': data[0].project_name,
        'description': data[0].description,
        "start_date": data[0].start_date,
        "end_date": data[0].end_date,
        'milestones': Object.entries(data[0].milestones)
      }

      let filteredTasks = project.milestones[0][1].tasks;
      let selectedMilestone = project.milestones[0][0];

      displayProject = ()=>{
        projectDOM.innerHTML = `
        <h2 class="project-title">${project.project_name}</h2>
        <div class="period">
        <div class="start-date">
          <i class="fas fa-calendar"></i>
          Start: <span>${project.start_date}</span>
        </div>
        <div class="end-date">
          <i class="fas fa-check-square"></i>
          End: <span>${project.end_date}</span>
        </div>
      </div>
        <div class="progress-bar">
          <div class="progress" style="width: 70%;"></div>
        </div>`
        }
      displayProject();

      const displayMilestones =()=>{
        const buttons = [
            ...new Set(project.milestones.map((milestone)=>milestone)),
        ];
    
        milestoneDOM.innerHTML= buttons
        .map((milestone)=>{
            console.log(milestone[1]);
            const {milestone_id, milestone_name} = milestone[1];
            return `
            <button class="milestone-button btn" data-id="${milestone_id}">
               ${milestone_name}
            </button>
            `;
        }).join('');

        addMilestoneDOM.setAttribute("href",`/milestone/add?id=${project.project_id}`)
    
      }
     displayMilestones();
      
      displayTasks = ()=>{
        filteredTasks = filteredTasks.filter(task => task.task_name !== null);
         if(filteredTasks.length > 0){
            tasksDOM.innerHTML = filteredTasks.map((task)=>{
                const{task_id,task_name,status} = task;
                  return `
                  <li class="task-card">
              
                  <form action="/project/task/complete" method="post" class="task-name">
                      <input type="checkbox" name="checkbox" checked="${status === 1? true : false }" value="${status === 1? 0 : 1 }" onChange="this.form.submit()" class="complete-task">
                      <input type="hidden" value="${project.project_id}" name="project_id">
                      <input type="hidden" value="${selectedMilestone}" name="milestone_id">
                      <input type="hidden" value="${task_id}" name="task_id">
                      <p >${task_name}</p>
                  </form>
  
                  </li>
                  `   
                
            })
            .join('');
         }else{
            tasksDOM.innerHTML = `<h3>No Tasks Assigned to Milestone</h3>`
         }

         addTaskDOM.setAttribute("href", `/task/add?id=${selectedMilestone}`)
 
          }

          displayTasks();
          
          milestoneDOM.addEventListener('click', (e)=>{
  
              const el = e.target;
              if(el.classList.contains('milestone-button')){
                   let milestone = project.milestones.filter((milestone)=>{
                        return milestone[1].milestone_id == el.dataset.id;
                    });
                    console.log(milestone)
                    filteredTasks = milestone[0][1].tasks;
                    selectedMilestone = milestone[0][0];
                  displayTasks();
              }
          })

  }catch(err){
      console.log(err)
  }

}
data();


