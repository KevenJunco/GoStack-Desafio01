const express = require ('express'); 

const server = express();

server.use(express.json());


let numberRequests = 0;
const projects = [];

//global middleware for debbuging and counting requests 
server.use ( (req, res, next) => {
  numberRequests++;

  console.log(`Número de requisições: ${numberRequests}`);
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url} `);

  next();
  console.timeEnd('Request');
  console.log('finalizou');
});

// Local middleware for check if this project exists
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exist'})
  }
  return next();
}

//This Route Create a Project
server.post ('/projects',  (req, res) =>{
  const {id} = req.body;
  const {title} = req.body;

  const project = {
    id, title, tasks:[]

  };

  projects.push(project);

  return res.json(project);
});

// This Route Add Tasks in specific project
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  
  const project = projects.find(p => p.id == id );

  project.tasks.push(title);

  return res.json(projects);
}); 

//This Route List the Projects  
server.get('/projects', (req, res) =>{
  return res.json(projects);
});

//This Route changes the Project title
server.put('/projects/:id', checkProjectExists, (req, res) =>{

  const {id} = req.params;
  const {title} = req.body; 

  const project = projects.find( p => p.id == id );

  project.title = title;

  return res.json(project);
}); 

//This route Delete the project 
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    
  const {id} = req.params;

  const projectNumber = projects.splice ( id, 1 );

  return res.json({message: `the project of id: ${id}; was deleted`});

});

server.listen(3000);

