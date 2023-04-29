import { Router } from "express";

const router = Router();

router.get("/home", (req, res) => {
  res.render("home", {
    title: 'Home'
  });
});

router.get('/realTimeProducts', (req, res) =>{
  res.render("realTimeProducts",{
    title: 'Real Time Products'
  })
})


export default router;