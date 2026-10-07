const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const state={cover:null,shape:"משולש קטן",pattern:"single",finish:"נקי",price:109,fabrics:[]};
function basePrice(){const first=state.fabrics[0]||"";return first.startsWith("print:")||first.startsWith("lace:")?119:109;}

const forms={
  full:[["long","לונג"],["triangle","משולש"]],
  half:[["bandana","בנדנה"],["ribbon","סרט"],["bow","קשת"]],
  both:[["long","לונג"],["triangle","משולש"],["bandana","בנדנה"],["ribbon","סרט"],["bow","קשת"]]
};

const backStack=[];

function restartDesign(){
  state.cover=null;state.shape="משולש קטן";state.pattern="single";state.finish="נקי";state.price=109;state.fabrics=[];
  backStack.length=0;
  $$(".swatch.selected").forEach(x=>x.classList.remove("selected"));
  $$(".rating button.active,.yesno button.active").forEach(x=>x.classList.remove("active"));
  show("landing");
}

function show(id,fromBack=false){
  const target=$("#"+id);
  if(!target)return;
  const current=$(".screen.active")?.id;
  if(!fromBack && current && current!==id) backStack.push(current);
  $$(".screen").forEach(screen=>{
    screen.classList.remove("active");
    screen.hidden=true;
  });
  target.hidden=false;
  target.classList.add("active");
  const topbar=document.querySelector(".topbar");
  if(id!=="landing"){
    document.body.classList.add("flow-started");
    if(topbar)topbar.style.display="none";
  }else{
    document.body.classList.remove("flow-started");
    if(topbar)topbar.style.display="";
  }
  updateProgress();
  window.scrollTo({top:0,behavior:"smooth"});
}

function goBack(){
  const previous=backStack.pop();
  if(previous) show(previous,true);
}

function addBackButtons(){
  document.querySelectorAll(".screen").forEach(screen=>{
    if(screen.id==="landing" || screen.querySelector(".back-button")) return;
    const button=document.createElement("button");
    button.type="button";
    button.className="back-button";
    button.textContent="← חזרה";
    button.addEventListener("click",goBack);
    screen.insertBefore(button,screen.firstChild);
  });
}


function updateProgress(){
  const ids=["landing","choose","forms","pattern","fabrics","finish","result","feedback"];
  const current=$(".screen.active")?.id||"landing";
  const n=ids.indexOf(current);
  $$(".progress i").forEach((x,i)=>x.classList.toggle("on",i<=Math.min(4,Math.max(0,n-1))));
}

function renderForms(){
  const box=$("#formGrid");
  if(!box)return;
  const triangleArt='data:image/webp;base64,UklGRqQ/AABXRUJQVlA4WAoAAAAQAAAA8wEAEAEAQUxQSEoYAAABDMdtIzmSlH/Y7WZ6znwjYgIA5EWlNN0lqgN1i5hjCWDckQaJTq84TvKGigdMGSmqAK00M3NOEKzogKehYKgKjY0NlXITuSjdPdTSa2+Zu5O27SfGBXCO6wUc4rYq1qQt7nuXjR+CM+z1LHtNKfc5IeNFmzybsd4h66XHkx0erXiMhwNvyz/rD9v/9U37/7ulSZAqDi0tNsFmwItVVubDirv73IfNXy/cjmGvHsjc3VekzAWX4syQlharQBOSJmmS+x9NnvJ4PvJ8Ph7/RcQEeMK2zZC0bduW27Zta3bP9TzPpUdD257Ztm3rsu3rtNk4W9VlZqUzA8c+6KzMiCMiaxwREwA2X3TTDxUUlhMVFxY+06s+5PhH/kdDoX//Zw9nSrCf7qJx8IdFg+pLrZf8MAwXLcpqLA1e85p3f/a7vuvbP/Sul/riJf8G88Gzb09uLf5e86Xvv31jYxIDSKIz93yzgwtfhdnq82GKeO6jNTkiL+GuTzY0EOdJmqJ6eyYH2u5iCDJQezEUiYhqV2Q3FXR3fXo8TNBzAJALqLRHAHmXOIzWfi9QoGdAbaj03aHNhFvW3D985KmmuiJA9ScNDfZ74Fu6dXRTh0C7a3UEZAlM3/4qpz7XYUREZ3eMbybGMp/8LkyWb3+VQ589APvSbY92ri+4Bs//o5oYvP0Vhnnx42ApqBYR1R5Z31BcvfYLf06s/qFhvkbxuBw3IaKj3z/WQkh97o+2Ndh9xCCv24BRrRtVKlJGRGXLR7QQTC/+0n0CJrU25u5miNffhWpF9aLAzDRTRURl749oIY7u/OaihtllaIxKbjHCb2DlNKtnNeRTQURl7w9vIIBsXad8G6qBgyeS2XvxpVWMkysAZD0Af74/vL7Y+cDPnxQAli7QQPa+SzpwVA9GE1WPiI6vGtlCzNhufG7xhjkcLmnHWsINOKuiZkR07pWW4iWu164AEaEcuUNrWHsB3j3/zs1i5Qs5W2spImljYWyvuh1TccvD/iHy/vJMC0Hy4tffdI8gBjsM6AumbGfI5FLaUtoWERXPFCGvvulEB94MT2ZpdECTWNjaLBgQfT6updiwt/2+C/DqhXQ+GS7SdP+MrQRMS55LjRMWbafvrYJvH+bzozBbelQvxuVbbxASDad8d5kYp4LDdiIrr9qYm+Fq1fMthUP3/xUR+3rMAQ8x8to/ROo9opLnW4uEBpPf95DRc3N/J7JxExwdZ7yIqr5+rqUYaNBnfhFxcEzGaDob/+oKoEoAua4Qwh4RlTx/i93yNZhcRLx/jYkvkztZAGAmKuKIBZFvx/BES5f5UBGFL/CuJJ6Fx9G2J1/olmTF6t066qFPC4MUE//LwPdT6xD5T346pbmlSmlx60P7ayl2libplrgDX6oJo6O70zKs0ke+/Te6gQIAOW0L6qfbI/Am5cxAV7Zu6NvS8rzziz9yHZgrcYSK1nhNr6R//OFoZeHcppblXR/+jl97PJBAGuVJfMRkeSr3U0myTvdR+5/eMqed3XJ84Kbv+/cgBcODQ3h6hj5Je0wAEXn2bOjXxm4VHO+/7VefDFOwlBkYJ4rXZn16k3n07HmpX4rZc7Qb8N8f9qUAMOdRhJwWkld1uh5Je01E3ZM/vXS3ebv38W/3eTyknqIGKqnl9b569Cbz6fv15Skp5itj6v9+9RPRxaqwBvMGMmiL1/XYyCXt2NGTG6ZmmKj33fprzwdYP484tOvo4lJfu0dEVdu//Z5Pvm/9ecPNf3tsnkRYR2u7a/cCmVu5uO9nbnrf+vL+m//25B4ALAXVUSvk4YQL+dQdmqdZo39NTmVwbN7UDPPx/lt+48QUZkdUIYJnF1zQ0qHtmk0m81tMRiCq3Lfv6yk33ZRuDl7/+e/9pb9dpDIamZHbBFA+eSItYXRFcLw63ZD9R/aOP/xMMMYAEgrLD+T/795u3TrbYteL3n/z3+4SAMSlgqEAMsj7ITw4SyDdCg8ydK/vKmM1y3oC22JOtaeC3EGK7Dv0+4JxaXGxJi5j6q/fd26Uw3rY6wUwq8a6gqbEBEDfGPGgmYZeC3jY+rg3ANwVaicictdGiXjxyG+LFt7Vs5U9Ftgzek5bf6SCkHYO09LaUsL0/EyV2GZkPHmGyWtm3haC9dmJNkR8JByrDF849svS0ZmZHR0OB4/siVmZfZZ+fX1IGY5qtLWkBmrJpNdEk2/TnM4sbIfon3JHapeiek6cOPH+ihUrHsvJudbpdMYZyeF0xmfm5OTcu3TFumMna8hNp6OJjCrae1I0YKt7avIU+B4b1ARK25TyZpp7QLHrr7/+OrBq5coHcvPycnPb1qvr1KxexAb1r83Nzb1rycqVK1f+/8hff50khYdC7lCthtsTuWqieYllDWcXatF0p8/l9Lx2UDk+yBm/V/1T98+Na9bm5//Fn/3Zn/3ZX/z5n61Zs2Ztfn7+2jUF/9Q9sXu/i4hcLuJxGU9vqBU3TjNY6CP5JQ1AJkbCu/9mabsWU6FZlP4vrxHUPxgwGRWhgHYKj2/ZchkJcH4REnmLt2zZcpIiX922l4jIfZlHNCTC6giVUllYLCvmA6yeN/rHnvQ+Q672GnwHlkeug7ZropW6Tl+ykgufuH0VDAQDAQUiSE1E4VAgEAhGiblBYiFGY7FsNAlIXJyyoWnq0qtZvN0YGqeciDIt6xBWz4iBSm2oc13FS2H43yuV5A9pE3t75tgKBWBeNPnCDgDfsMXmbXVj/SGDD5zQvOvJSKYTDpY1oeELx7iQ33uVygOuyhhXBgDIuSCFyYWI+LrfDpjsiFPzon9Sub1TqdDxpqvRgsKAf7Vms5Lq0bJN8jADVAaL84iN2aNtIwHXTf/0EguudDXvDGHfOxS6TvdH8SwNSOUbx+W1/g10xwNAjxaDEdUJPTTOBHw+FIpbjvn4RI1eoSFq3hUzWA6dV0fR9PzBWgEQgZIYEM9cevxZmTwW3n37BeD8/X9w5Rmj04rd22+/fVr1+O0bwPywanDsmWeOSaDQUP0RAWdu1LI/1WxmsYndTmUAErrOvaIPzVTzhZxBP73s9/u1E7RmNCYQETA8HE46RtMKEBGqiQjIw6q42+l0NTAvkT/5ggYGC1Yp2RiIWmaHQcuOK0/rsknNL8N+kakXMEe7crjerO0f2zUBri3WofhgvLJXnmewn6BfSqFmk/t94BUONTdB6xF+7Up8HZV9KLM2Fv9n0w/1ZtZqNH/aB0dPiob3of2dhZoRTVX2HUVgqdvFD4PJabXaUI8cc7mIqDLMi0K0V4WfJ6WtdUDCEe3eUzY55NfJH/L14IG7D2uCAo6L/vkAM2+EWWuNCl0v3XdrCnTNeFez7XZFr5L+W+OYoOXfmnhw2cXan89zNIxTp3yd9YHjTa3crZXYfmTgQbC980curf86UwIN5QAu+zZA78QzGoWGKens0i/Ygx00+k1AZIMlvBroZ9cNI8u1oVlKBob0W2FjCP0UjbRXhuQ7Il/tDSUaa7cWgMVOxzXxFChZQLofrQeWnX8oKckrJVZmVz21XPqqhMGhdOlHOxPocFyLb4sSFBToVjMLbD+gxFEamKqpU0/VzUqPhKjUNUIFRCEc/r05GO1QqsHFmo7RmpToVTsQjDcvMxqEtRaMc4/MqWJQYyMDlGKWFHUuNwOzI73qLtc8He0dka18MD/ZcJYT2QYWI83v6EBk8xpOdmY1Lt8OhmepI9oS7VZtaVsz9uL+4FrUz9pKAwgUK7WqU2pZS2t2tWeC5XqvaXC+WZSfiISNyyPtMOCDXIPSrRQtDxdg39crGkeBQ185mULyYXU1naLc14st7OoCQzYrI5LkrZYOhYY3tYazlx+2gfF2x1XRtCh3bsL81pYw6OtEQ1mnGDeKF2uXV6PAnZlg/x6Pqo8ivfSJLXPfxMGoXb1Un6iR1uvStO+I0lbcdb0AI86OpkIRLjapePsoMbVtegqM+6YKTKgJ+zRnJUJfqLK7uaPMSTvL0EcVd8KQjgdWBO4IgTsq3nX9opmq4TYYuYuvwaZr2TAyszM0I2M/jJ881lEK5hfbhEWPjHm5vA8GtT1XtXp6xa0aRt/oCIO/osJ9IjNKV9GeVHW8mG+e29olmCUBEoAGECq06MX+MGybQ8rEg/Xq/ARM7usNw2e4le3PXbMqCDRYRj7Jto/vDCSMyxHkCBblmZmnHoeBM44rGsYt6txh4otUcHCOsqT02FjCq5nE5k4Kh6Pryk9HmxkJ93iVoMwF8KI7m3kfiQcPG51T1MbdF+44syI9MeWS7Z08uURra2mj9h4Ye4hXCVYCeMthI/8GcHKzomLUPlpJtYIUsVicPnVuJ4HTWeRWuGnjFRj9joNK/koA3jJpsrNrAi9aH1QC8l/RiPvwXP+5yylcF7lT4dXQgv9aw+Emr4Lg7cCX8wYr48HPwYpacHyoHOiuGJbn9zVcz0O43S0jaaGsufHQq2gVrQK+G/X/D542LokpIDhZXOg8KkHwYDLMHcMkh8WfwMP0CyvK/3DgW+p9k8IVPEnloRhyNMw4zUfP3XV83kk11sJh93Rs4z0uIH1TJI+3M/62jvu/4KztXV84xhSCBw3C508/d+ncYULwY6k80Alh9RE+wPaQpw7RFDxew5UH7rY8SyaTFpjt37f1bLebEPy5OFN4wHIghxPAoL8ivItHaswGh5/gWq7NpYam16E2kEfwbqHBsuuSvy03kPpanT8bP7TqkzgexX3Ps7kwNzHkZ9q9ugDXPHDnaAI/YJtfTkT54xWvtQCXO9dwbC0sT50sSzaqdGcJuHrdQaJKVF9pBE4vsTJ04th1tGEwky/IOEhRxVfA6+TfzFa4pdlMnj97ALfHmsnRBpxBq6V7Ii0Gv5sXxzQa8RMKTEUe5FhNjhRUpRJL74C/jgi/ODiGYTENBT+21++/EKBmz5HV55+3472FQ6hzvjV4blsW0/gSsdLhyb2BButZbkXB7o/gVFVv8D15v4lQBrQe7e0LhAtO8eUroxJcM1EhtBXLvls5FRoH3ueUa1EkrSRPjhukV6nb3788JbCW/7clwDfKK1z+AJwqTuAehoU0SLb9EWlGgGigU/DXQKnRov5b+FRG48B/23sa1Awi5wLFyvmRHCi063rwef5iWwxAl3LNtNbauXaVhJb1teNUW+Ze0ioIg2itcpKUS/6JMPe3XdIIUJqFCjl1Ik8VqSvFpAkRo9pZMPu5l7RiyolU3hpyk3g0Tp8XjNbB/N8eqOOZucG5GKM15QI8+1SvfGIBvm85LQCerRPWvuotq0xnqUs0NcVWoXZyKQHfdxywhM8Rz3v7VQsyk2fOJPFoZ6+JXITAgvjUL67MwPePprCIz4Y5tjrE0V4jd9V+mgg0VD1JQMhG1svve0gBql9PalP/5IRlXKqBHPjmaBlqT4SXzpVoHsbgmm0Aw8NaxQN3RgCg6y0SQ//0UljH5K3qoH0kU/DN7x6aGx7eMybUlVWMVQTsiVrR/TG4+lc7YCVblKrz67YW0DFYk9DmtEbD/R1uBkUBrr5xsJhZF7j21FObcXmFl2E57ncJzcXMOb7+WbCcmZU8QwyC+/ENcXBNw4e0qDUQBgoyVDwaFvQxrvEulmbUIDmAJ9ODtIY+9khgYKzNHL8GlnSWqnnUUjIzomYEX6pRgJqHl0bgerADLOpcNWtkMYRO4c3ZcdTMwffdZFhV5w8GUgW/RHBpPoZP42mNQYfPsVawrl2rjFPMeVX0ntxM4dXsHFZnHc2msAOs7KMhw3g6vDiLR/Dtc2GNMdi+boe1XRYjcs1BzDePn8nh3wIrCwmuvjcbwuImfRsbZteWtiiND2chPNxXWL3MufjGwvom/KDXVHgBqrRE3Qn8vDUHf98YWOEuFToV2g8AUm2G0JnDz5QAco9WpWy8Y2CNF+nk0YU0oFJM0rT0lJ6hrjrW4RJ8FBY5bS9bMTljVARoS3ktZeIZC8vcuZKpCq/wnmr0YnB9EhZ6EVMmmvpy1cVNLtuTrVTCYQPIxDUV82+xRLXoDchMkQybbGwAS31jJXti6ZoMuCeGWEkChrNYNNhgh8VexJ7bcgSHFRvq9Vax/ckOqx1/MKaQQBC7Qn02QUdyW9cO1vu2kAnlLQBKu8KXNudg/iEs+VsGaOAz7+t8RMw+bW3NGhYpIwVgWqxv4UYO3httsOi31SrKpwAUtU9OvqAIvI8lw7J/rai1L0g/yEMwP9wT1v36UybAl/GUWXEGrPxEy8Ddmw1L3+CANaAeM89QWPzsGksAbWkpmoyH5V/GoXKmW6eE5VTWu7rUZv3SKrgzk4dF2yRXbTWdDRH4oJo8dC5G61IXrNfahUD9AhUid66NidU6G8Rgg6PK1mhdVmRTsD7QCKJwSIhDqmyBYn4kD4jV/jSIw3UcyoIWAC5tAjIH5/1pEIgN9vGnJXMJvtcjAPvpEIrXVpkz1rkCzn4EgnGkl7HJztpFRBfTIRxHhdgSe+vCOGO071YIyHy2WjQLzKisapLBMtXZlwYRad9sTlRpRiyq7HdplbsbxGTbQ6bEm648iMo2X9UZ7LPYrjBNJ3pAXNr+pYaS1ogAVWuWovsgMt95cRXDeI7GZE5NoohTVtqItRvRLRCbGUXsGMz2yBgJpbgQAXFuY+HGlf4Qnc3XszMWTeICHlxE8HB4KsSn7S1mBDVhmubmthewroY1VMypJFmAoNE6VuwuzM075nJlayRJ1Ak5fQ0hapvkMcySVmztGVs5MGFfEuouUk4LxQgw1MOG1k1IBasgbcmK/MF7LxYpm/pKaUbBPqIEQz1MRNMm5Rj1o9xGNcVxUSRO9AmMq5oJEwxxsUDDJoCsF3bmZKslq5uLE9xYxIDBclwP6F7lQRI7ty9eoCC92AAGNQfoIHVuBoTqE9oVcz5r4bk0sWJ/X7Nyp60CdaSvmL0KwZp6Vqv2juWpANBgKdWK82miBXkuk4HZ0xpcl/GKlyFenzIbBP7VGQIm7mfvFRMxEMBcMxvcFSdgkHqIDK0EXwhAQrV6ZG8kxOztPkOlAV8MEqzPgqhdZKjWnwVxu9xM9Hn5ZkLkLjcN1JWs9vaC0LX9aBbQIU4LkyB4W+2kUq4BdEmD7/gRiN8WvybZGpCm4Dv6IkRw/eVkAmeKzxudIIiX+PlEI058vbMhjv+zk0vInSmn5rZ2hUhOO8Ily/ncgi6NfZMEsZww7kqs0aLGcK+J8Z0DbRDOt/zEE82htpI85iVCRDtXcKRnSzfheeFBiOqxZ7lhWc/GDmy7DuI6/f1YUPZD8C9MgdCe6eIfSfA/2QSC+56PuXd0wMv1+bUQ32PcMUCy8vWCEM+7wj/T2kz1LAjyG96NHeOiTnHeyMUciPMlXj5JA4rqQJs4lw2RftcBLg10M+uF7SDWU/fyhjIYzEJbu1Mg2lMLOaMvkYFLC0tnr4F4ty3ycCVI0HzrOOxeyIKQHxDgCZGB46mdyiwI+ml/ccRkt4BV9wMQ9omrjCd72tgAVisHQ+S/Y7joueumLhR2HoXQj59/1TFQbih6AVZnQfTfdtUoeVhhfFPYCM2C+M+7ahCZ2yhVBpvvQwbmuY1hN9yBzYJkKYA8N3fGhY2CREjCPDdn9h6QFgoSIQ3z3Cria45FAuZLW0Ei9ncrQ+bYBObLekAq9j9fz9tlPSAZ2+7hhYiluSvdIR1T93DixvOFuUcgIVN382FjCNPBJyAlU3fzQD6ijK2ApGz6HQeOLWH660RZgabfqdD85PYZmF7XEPIy9X1Fus9LA9SdS1NfxUNqjolqVEeaiRgCZReGQx82hOTsX6wm4HKUYHo25Gf6Dyo4B/uxoXX1JAjsG4wyP4DR8PIESNGkpR5jpKWR8KOQpv1dhjBb8TAkaj+XJw7dAqnaL2I3JROn2kOy3rzDbHHBgH9xKqTrx5as9OYCjfflQsbeNOc0HKDxV4mQsx97kI/s6Sa+t+Ihbf+VTZig4d7bIHHf8QKXpsEvEiB1X/2fLuzq5YTsfZzffCfk7zsmzHrDnZDBs6uZKu0OSdy7mqHS7pDGvX3MVHaHRJ7HSmlvSOV32CjvBrncsoSJeZDNw1n4sZt0si2w9wxk9Da9/nVKqWb7tZiIVaEHIKcHhjUoaUXtw5DUtnc0qPkFpHXT/dqFesor5Hq1CjwAmf2OVksgtTuXa1OcKrcwVxP/MEjupme0WATpPTSsrqih/HLuVOXLhgTP9qhZCCn+uoqSeDnW/Kyi4CRI8jmK3oQsTypSUNlKmuGBcLQHIc/t26MUOCUaBoUjBDMh053bI6yDXB8YIqICh2Rz7iX6uz1k+/NEEyDdOx76Od6SAVZQOCA0JwAA8L0AnQEq9AERAT7BXKZOp6UjpiWz2ujwGAlpbuFwbQAaPhfk2ZR7/0vb7/sPyy9F/PZ8S6Tuhv114t/yrnK/ue9v5lagvsrte+/j4D/j/sx7Avuj9v8+P7LzU/lvUB87e9F9X9gD+f/5z0Ofrrz4/on+t/bX4D/6H/f/Tm///uQ/ej//+7X+7RYUIs5lHkUTzS/g5teEGwLcHCZEX6TV2VlfrB8pN7/KA7gNNSDWhWdecXUhzaVHK4L6occg4/qrYamYaHhYMqtETTnyI9jmbo0tn+EJ8A9vaT/1dUkfljkveAXWjWM2jH/o2Lq98Zeg6oL44PyroACgtCD1oVnXnF1Ich3Gg7cLxv/+HBBfZjp7sYsF7GEPoeHCvK6O1DVJbMJOjhkD5QTUYNcIZGYLYloaEV6Jhv5lp5ZYEsFMNuTCLtTQt4/O+Sx0pC8xa5Ijn9abJQOS8boTioLcgJFrwaWQH5M/t/MFi6N/UiWhVVvw9zio3iyTAvge3j2W/S6/n/0gsR386TnqHBCFexryzHQN6J/JUA3PH1eIAxS6J7EyarjVPOQ8gfSxpPWbdxR0qq1AAVOMwb/7y1/nrWkdTlwA0dBJ+XL11K0fYZ9UAd5NGFBmkHVVXTzOpVdhcpGPe9q5mdGPhkAEggTZ5dzbqB1vr1AmLKfIT9oW3nU/JW9MM/n9D8cpqI4Gn/+/dcp/PtESrvfPUzMS8IFYhMYt+h1srRxn4ZUmYBOwAYBCWZbe+4iXDbHQefulk07a9x9eSy9j+Ir3jEpwyvenx5O3AwzOnYDNhNHAR3nVxgDq5Idf7zCRCiQQhzdZ5lGUpyVuOm4z7a+sprCar6+ujxML+Jjf+ecD//+Rh/yj+fnn5TJDEdK8rmlgs5a9h2ZJZuVlJ/sg+wiDnwpYlHhgrpgNAvZAPBT1Mp4mTMvnx9vYMCg3I+NT93bDWrUCnIiVEeihjs2peoXv3AqAXfu/NLsU56fHdUlcYgE8F62sn8Gz9vHGD5iq5n5+b/vLqRTQCv/P8xaH+XqHauPLr+CF0nc+vT4qruIBlZMe1V8Pf46ejG4ZYJIxsmu9bFx5IXA0ue8zhP7ggkowNsSPhmNOwFHz650JV63gOeqPNCvfb5zEqMBG47KiQmm/b4YZao6wwm6DI6RYr/+QWHDOcf/xuO37AkGs8+/Dqpz1Ce2rrZRU5e1R+F0zg7y1BqkGrU+gOeu/GeyE3zZ6EcSrfCk3zXVTjzo1AIB4Cg2xR5mlpKbDxWVXMSG6WKoVbP1sXmzfKbPxnNGx5ylS/AHyR4Sc/uZP2vSipurB9UAC6uK73od38Xj8mg1U9DFucCmVXTYJolYidkjvENzz5saXUc26kPNaFZqM7DeiiHDdliHm0nyNYFF1kpuzHxgMfzP7xdfmAOnpDOij+YZ03BQ3myPg2yZZdDvYZCw9RQhqNj9267v+hwx2V9m3O3JELIpXmtCrfROev9QEBzlvxgRN3ZjjboTzVo0OoLMil8IHEXOgpST7/p4B8f7I6cOGmTClbYRmv0IDPtbfI8Txq5IhZFK81oVnV3aabmjw5M3466Q/GwrhQcLV0dSBTf/uyeEiBX5ES3aQuby3zbHnew990Ms3+PBp693Bbb7KcIJoBOYP[... ELLIPSIZATION ...]OduQ2WldYOEPOUkW+lMDBs8MFjceWNxQPfpaHF5S5hI9JLAvQrNUlfW7DeD55cImNXIh6xSWOtIn8IeQj4dT1SVZwX090Dyb4aHaFreTjZiUNm/Q6+H3LP0cboIuq0CmyoIlVSuyhr893szNLVs30PuR/7OqpbFKnEOJ0ospSa2U6+KmJftgvt0Sbll3j+wbl7yv5S00P0culD3/5wnoeD8Lnki15pgdVS1l6YtcdQ9clrvhU6Uvh9jylKjsjE4kPEdsEG4H3yxnWwHGf02dMVFvLXtXF6u+Rd7FpX7FOQ7QKDDu6a/bUr5sydE8dOdl1QH53znG/y8IHBCWbAuYW2OwjFyawIc6K+xj9W/OuUbAJEdqj++fNmZSxVyxcXMs8umn0+n/tld/m8QK0oYMdG+lxLMi0FUbvzH/jzwpkJPbZDy09ZgPQUC5cHh4qJIZYonVubHjoaNFI1lxcl3VVihpcq7VVV2l/ekbMICHJNXxx+27smKksU03qGMRD+ZRBdcVVla6XhuIflZbAqp/8MEIDuenJqgsLkZJsZqKo2SSdAyo/MPdwpbGlz7LGKUnj0YtBGoZc25ma8S+Gv2g191VFD39QljcPbGhkBuXbIKaIHoE9jVCfXlRl5wVlC+E88tweff9ppAW/JFztFuK1mxEDjxdv+1jhmfa2LEv5L12e+z0kYH947IPP4Wqavst4TvTlbWPAi5TVM/uq1fLEavpIZzHqKBa/nB81qCAeto9KiobVGcDAb1nsB7/3e8jRzhNosX0hp9hvqU/Lsm8HZ4R8o588bLaP+A5X6hWjRR27+Nl2H4RB88ZPV1SPRrxGLhounYy5on479DEupSNw5YfJx3azULjTYqMQ2YkD7aOUh5jUqW1LXeZhBH9KCMgrXwnyPTMTKatLnQyb7bOd4WDp2YB8wGpp/+M6LbxzpgH9SRQV7wvOtfoZwq1jurywQUE106UrOqEEptcX1oyXsOzzm6EYxr/PdQA+QRLC4YXXtOljA0Rjfk5pVHKS3Ln99QBoFdXqdGpTp1ZDLiB5cfCNy6CbqtP+ja1Q5yPmm3oPZhi2PxKv/sbsZ7G3R1N/en+4ts0VFWZwz6Vx5Tr+DMAtnX0PWSJ5QUbJEnQfrAiiySM3UoHeBNzD+k/jkaIuER7og5ReYGM+9AbJ1cL5E9WRQnTxjoCq/1/KYnNxryrSfFWwPSxgOaDlK8mJ9ZPGa9l8ODH9ePKA+XMTn+h9oLe7q6G6NTJn55S4v1u1hmri10ShLs2zINbpzX2htfsHNgsaDtOnPbvGko1ZoTxDDF74kXa3q3u2+t3CvwhQfagQAibf8Spa4Lo3GGPcV/cxo0vrqBPMTgl2b9DAEnth+V20hGsZj5bolVuf16xSjzhPA7Pj9OBqXOnjZnrPRezR0xfh8pSs/Qi/OMuGbU8AThyitC51rhOOvdK3pgB7bB62ncY/BKSv5kA5CjIK6LsO44gauBtLjPazRQZLXg4se/AgsRRKSvhZOfg558gA/N8Evl3RVjgVbveC4W4TF+7XIW3Y48taNJxp3O1rjqSGDHbSKWi6CkOFlge/35PXzppzjuxpmtnw6bg9p6Ztub2QTF9aLSMGbgyaIaanAqOfuJ0w7hk6WJMihglxZrs5uxJ8mN7PxBlv/8sfBCr6pCkuStR6ji1DIYr1VfWF+Gnff5+u1EINhnSnaQP5WZ0L9hweQyK+cPvMGTiXVGvCdrNw4O2Ftv2S2AwCFXkTaP3Qupw4FPfKidPHiaVx/9DK8NPeMCZJqjTyGXxOJmg4NvIySObIJu7hYAoBW5GyKeFZgntvSz+I3RxpV7rwyUWksXerKWdvl5ljLk2WlgQPvU+UYO4eNVb2ksIua0Z2kUxLZGRExBwuaZfSYsmM+8X6LuVyFwSvS6XueeYz4WLP+U7AgY9PWyJoqWixK8QvJ3FFzH/9CsS0zu1fpjJJHjtWIdzpXs/R9CPUHziY6/ZuFBAGtdPSrvdaVRnJX4DOG2gpMoHZhy/+xeeeRLScdmoGINuuXUJ1mNI97g0dSTMSh0oYymbhHiXkGHJAVMGJCqWWHQy0UEdLPDW4IKKdFfXeQKTeamQ/ZyqsDkNQtC/opSyWDZvBBPJc+Ts8jnafm6K9Ti9kSyd5CS+AE5VzrEClr02uUsByXwDcbuVSD/DKCufz6fyfic9kHvHbBJkSV+sWP7GnTgQYyLdBAoXzhyl9KGvtdgiXYNvb1rOOhd+jn2CNpan+ASlTBpICCRcil31zDiISKGPWAeJxuLndLPYZ0Y+WIj+Zn3GQkKPPe4v24oeG+FvtrIcyQm+8PTfj0xmIOncjyWTxs3UO+peAX6sg9zUOGbO6FoYHI8zLhalsp1jjp+Ain6yR/Tj3bcodsGY9O3UXfxiSV6FcKH4azCsugFyIRbl6Ppwlh2AQ7tcunl6jcXRSf9vv6JkTxcVGC5Q1EGqLDG2GvhZHwK5B3FGPv/6Fx8QuDtmxC3MittCFySADmtP+mPOmdDJX0ju+sMEbqqGSnahqO0F9xF/NVq/2tf5nbDujW1TpHGnSl4zaiNU9v4D6ea2/nTdCSgZkuILOZhPWMJ6VBOW637Iu9GUVM3T4Q0Drpjoo/hDDH2jUACp46gPWviydbZjo4rSmYn3T2j0zeUDTQPUEe5y+Y5xfYhyuYwBahwjS2/vJrk2aigqSBJ21lSj/BhTLbz71C0vJ1g2jESrUD6hUVonvzREWArX8cHyfwwBt+asB+oQcs2TNepZqpXFXo875P+ZSKX59TM4nYfGkuRwIaXZ080vYaItr3ZSUMRBczW2BL/bk4uv3SQCxwIhMtffbgXn3a/rKjjce7kx13/z9ukxJ6ZFdn8NY4POk3j/OfT2I4x3q6xftNjgE3Pty1zmF+oQvbvK2nAbVvNShZYsCC6cWALHVIocKfx/quEz/FRS7499DzTl+LAcYjBtAU4/ANCMHggsP0YSEYqDSsHudwO+Cm8cbeBTi+PfUN7omwSa7SkmJopZfFjpW6hpxWpt9xSa5PBpBa1DbtTvIe9vFTkQ5tEZnx+zQr1MqBi8nE9SsuFk8uzMawbv/BmR6PpSPZqZ52jppby4Z1ZSzI0hBj6QIGALh0b0/lWNdpznjv3peWCHmNe5iYCP8devpNRToLo5fLWsOPUOTwj6fN6bwLiyRsQ0IjvnYi9Ce7a1WZTATR5hqeCJSUIR52ppMZ5A5pbA0eNLYewepRk8HxT5mxYgcwtDZymRggdPgTlCjmGFdOndVDXN/ti9ZTRUvJzMBtw1wNI2ILGFF3IZwpMmB0Xm89Tk8dyYwGz2Kz2o7Rnw549Bs+xUdwiksIiwljqbVPm2lWqMRDaG/cQIaozICRDth32kCfOE95khE3E1F/iPQpwQlZW3x5HfKdYsz8g/2d31j6KAy8P83+3FUI0f9pNnli+dMUE1v2V77bVbenjpScoEewQoa9Q9TgHcFjW7QfKVXys000EKNQneGMpcwbY8gBbSXbi0ZPc00+nxf2hImqYYh/bUFnPYd7dpJ7YhnF41/323EN/2mhre2wrEEY8ofVdwzCn0Ub+ueJ/7iB947SHtUH3VN85OZbzvikj5jUJyxy02FI2lgmKeZKOmoc9mc7n8bu74BjtN2WhsjqN8JajWTWgLGvSlFOxal3cgniO0WYJaKHp7k8d0LuY6PPzjD1TB4Sh92L53ZO6D3t+2d5rRrPbtHtpenzxpmNaQ+KwA4wQo+Ni4+rpCJlUaL6wcD6Sp/M6rjiFAyTk6EH7pq34K1ZH1AnvbWVQa56Tv7jnBSqu2K8/yc/9v7Nba+pHgKNGEGX3NxXbjBRlkB9lA5GGD2lfiD2StQmcujCcUQgfwLWEiQtqhv80wJCWz+6ozO4AZ90kutCqkF5+bGitUGOdraByznQLEXdF8yk6XqEI2wX2FwiaeTrOR5GE1oCzChYq9SakO+K5wjSeXzgSh5ZlMP8fUxCl0zzQjWPSupGtbEHj7GYF/Y3Y40ajY3ezVBSRulFedqBxh6eti0J3WetjXsCk9zfS6UDHq4f1aVS7iR5f43Uua4fXvziUxSt7C5chvIZsU5VM36oIthglCpVmS/SmtArp3/d/fWyyeEaX7ZFXF6H9ereVStWopuWO8/4IpTasr9WGY+NWkvY0+qQjO+5uaRk9cLbgOhWDALsOruJcPV6QpTnRdyL13F4oGhNAdDauc2oAFplUYeMnYsD01WJOrllcyqamAa17NcTYsdFaSHCbOMTE7YPXU+vfbmEsl9FvrBVH7H4CFRfOY30zg4ZxQbLO0NSwqu2AYBg0QIfLmEAknfE/EnKxAMp+kY6m8CiXrXgyewJtg/+/eq36qEZOS10QvJfV5cq/vsrSah3tv0neAh0VQom3qi4s5FB+Mj+0sijHVCF695xrlRqPG+tM/fZrcZg/E0cdpu45+mTZGINw3/921Or+fIja2PPKOBQiXb/gijOA1e3k0ucyvPIiRsfYikSGRvJRqCuZoZP5vDkpbQykBH3uKDllZbUXk5W6lATTD5I+UgtanRmvijWjcOHOzCxneaBgI5tls+FXTEEm2+FEmquAiN6BfbawHbkW4mRJgrtjmX6zXzN8fVE4x7RAKycNzZtb6xinyLzr98TVB0iWf6zvtIUaqCZfOnmorGK7ggUHPuEs0s2fmIiI6kiybXYj4A09wwaWVICiKHUoahIJu/xvZFOszqX8nzjzw3pKBQxsgYcG98fGIxOUCY4hwDGIbcvOF6coit32QVpq0rnZ1BeyQNiyWmJVk8zrKWD/SnexoorVHWLnKbRzFQU+1+yoinZ3XSJHpOBM4lnHq43q8Fbc49c47sxX6CQp/jx7JWCq/0z3hNbqmxf/wk/fCbhA0/CzS+tmHdkvz+7YjQhhw86JxIW0mUGxeGw1gtW1qlH0t7ukC+fgr7KbOKawz9wZGVvow5a/ypJq8ZkLMhDySrggB+IKFItJdjfhrlFJ2KuKeUVar6HPrSYBkrGltazYruyq8m//9etfqzfvJz7JBIeDPOZUFHOgV2u62Xql8x0RZ/Gf2Ms0NnK8ApU+Pit3MTFEm/q0J/8KEl070ZKUcNA3fhdH6wrRi0rn7yb9lEcZJizQbvxtJHbC445cTO0e3ISXK7m2Fr58T6oefzpCgPR7qSLEJRjz54NVTbJ5nyFBskxUHc3n/yYiTPuhNS2sdVaT8zR3Nde7bxsl+jEC9mrFHcy3yyUJSI4GAvInDlABFwXBemOFUdUFZOsfKGx6whQGsxFJ1Mv8VW4IDO18CrZy/j1ckLESCo4ewylxEMT/dlUNxa/y3KFl7VmlZYasqisxvRd7hgs+NdvsfUSkCqIqsCQqquv56XgMgfb169XhYmfTasBsi7a/BzwgNVrgaThUAimCuFCf/LJB7YSTCRVWV1MNv9IqXRPbtqiXiRGSVFwvO6DTZjQhW070Lueym0Ylu9fmTFX1HqP3xLKGD6Dx7z+g4q8HrqTF57UdTd3tbQCSatKHyIDw17sAHq03+woTYkIBgO4Ejaa+AIy5XnW7cIYuKm6jUJwkTfxvc6C0Itg5FBTpjgXm1JeThT9SvtaWAPQBDLT2LVnaWmvTZHfrEQ8wm7z8BrgMqU5T4fqxIPGIVSJ5iIgyhR9TFpV/gWBcfI8dxz72Ou1Vg20SEdG5LZU/n9z5IkKfTFZxnRDVuYu0ECSdnVttBDK7Ou0JhBWD8CwrPtwrtiX91ckpq5AL1uEg+nVFs5PhzZWduWh3qilMhW3W6ZRHHhiv4hhmQnGLdVwqohJT4XltXkOXT4Mgb/grPr5flKH3AJL9NoyEVXsHKQO4RwvyTtpUlFgEFx+umJcnZewfr38o+eGDhn5jUkNaucc2alMKe9e/qXoq//tKs0XEJZ3HyOocn//8HBIpx0NxVCV5CXKdWxjqJM49c/plYsjxFyCI8OriLUFGvr1y6ZRtIT+rgh3u3nAkF8V0XBwTT3eRg4CMyGglXr54yEv71d4MlZfdx6WLlr9B27Cv5PeEfZKjcljqzpZYHIrS/urst9oZ9aGOkuH+YPHpw5ip4IQtTw3FXkou1W9mcOaM0ixPT2NUkDHXdVnRwV/zfto9DKzsc14ZEBeonIomqTfIwzxYr6xxmZRpTiT/8yBXWHZhyKNOyY/CD79N5n4TpiUkRbrOQEQKxn5IM1Ccfb6yZVrOQZx1aodL5KZoxmbdZ8F2a03wpmU7vqB5E6z/syGg5ItrlEm4Kr3VCApTRSTFiNgBuu5CZ8nYTxv375ScvhFeaB0948O5UdDeTxYpSsEWRz3zgnBIvJazzIxrfj3MsvVNkwLagKSD0uX7fCGfZqPVt4dDXcrHxfCzCm7ek4HDbP6rz81PcR5yh+74MdNzkJVoxyoFykJ/wkiIEGTNWxL3vTn2zoxwbL9LpCJQAzL3Yn4KRZaF4zCCvyoXNjsZZVTF+vUWNaySln1xGI3xxyLSDdRed0uWWKwvBMSRcKETmqZbGwKIIvP56JeN0bZj876eqqruAQKV6RwEptJEQc0GrKDUn5pjzy9Rf4u9JiQ5qaYeglw60iuFZQAkmiVVmPBE/RJDoASghAUP9BVa4L94oG1S1tU4R2ZIxbM6da3ZUdfSf+4J2OyuC+7U7kReamFF62F/sCNUQhlMrlfd+ObIbPibainzLvGyhEEOMuuVeaTEEtQf3WkvK3Ev7v90lnA8L3wpNKcrxm5gmCuSqGx8xxO0n4yDk+7+HNDJbFQT7mi9qhH580mjsXeund8vo83wgxHFLQz3/CIdjgAz62AUXzIOnQDhzR+tnA9iQqV6M3neaDKa8IbmLfAOHYEgaHYWU/CBMykqBOAMTupMaF7dHl5HEY0E8XLtYhNHYCWKrwPiqIXtafLL+4KWg+aeT3DsqJheNFakcWYNnnG6L2BxYrzVqt7ZrBRNQ5icUUhS4lZjy6v6kiDS/oIw4w0ZIsl5S2VpwCExDEa6JTxyK0Rbt/P1WDK+nY0lBwc8PAC6Ic5ya1WZ099FXa1EGWFMp5ti5SrR4k+Y3JeKGjAPiJGvEIVcN0R7v6fiTefw3WywNwHg5U18jg+7ScjkTouWjS4BfnQpQGpcXR+vEySB+cYw1kZ2PLaRUXit+AwrkxGLeLPP5aUIkZEzIa+tmc6jo1MUzh6MSL8XMEAK9bYtkOEjpR28JPayDKlVbIZ+HohXIAKVSZdZ1QRas/Xx9NxYw0rY9IrbOz61DJZTEZCAYo8N5r7oA/qGpgh8hxAlZF9gUIbn09fYY9I/ycM/nETD1GaBrN+UFiczMNUnBW4Kacx6I8l6U/JnRcMfBjCiFkh8GmQNG9GUVnbEVTC0kpZjYJ5jGbZeLkye3JtALHQm9KSRYb5Xr6+xuCP/9wRqiMdcrK/qTbfEzE/8GKlSbArHBmEa/Ajx2rKDXfsD2KHMP/aid+v8M8xQfOUCka8esIlu1oao41QIHaYHtBZ/b5usqmxb3mC17xTBhs5EDzTvISwP6YLCrdAMB9c6QoBHMHjZsCViOcfIYoTtYkdi8I0bjSB4+Lw8EI3BRcl3bu57v7xmtlly+vGzQpCjLsjs0D0z2BW8usYalVg7kfFQHDDpKVDJxtys97687HWeDH8XBYdMUEcjpyJjIh2P7qXo/ULKvCD7/unutjGYDEoZPEmdvzldRBqxMIvmrzowf8XkIc5d0geq0ht//XfulfWHnDvoRCLSBQPeMVSPqPaSbcfg5111ERTHiJG/SOT3RAvA7G1rK+oZFmVphSoeJcJ1+ojzwPLDzoKz55vB7Y3gmhAVH+7UFrMrz6Dj+8zZb/cUmSggIfBzsGpa6AcaJLpdb2mgXWh5ooIA4pEm5aHGqp3a/Bh+h1roU4U4btMtKoHw1NeWKG2gHUqGpqA8JEztaa+4RPMzKeVYBpgK/yMHFdBhYo1pSizuz/eA9ZLNIq0nSCWtKXO9yTOTWan728VjOQEMKdbU65uE4GkwWFgN0bwMqR9rgoZm28NuGsRboYwc0OGG3N7bffbrlo0BzPp7x6E/qZg18RLV3YhZwwPBL/4xWTLil9GXcpORHgBoxhYYOb+Gw7P/3vqpwK6rlIiNUeyXhRw/WCmqNSwESMhWrqgs5X8Mw2IjgSOFHnp5C6SI7qP4hJq80qui0prFF69MmSzsoK1q2FtJm+P083phlfm//aWqxfztBddrA5z8L9X0BcXunb41NAU3e8SAE4GlI3/lQ8Oy3iJuBoCRdgSEZCVOkbdTk2hdfz5fuHFdtBodVtJHo7R2vWmXHoVWGG7D5p3KzF+Q5j3NPye2Z8+zR3xHZul6EnOiuSLDmdIGokqMwFwQBGfLYp1VMxsQp38n4oBz/7JUUwN7qOfE4irYwksUKHJBZfv43hSMaK4VPgGBOlBd0CDD5wmuDozHfqikptWN36zGOHw5JOI+20YMaqRSWDkT4ZTaytUZeOnDCiTsvGhBUweeNyg/PwhfFn/a/z9zXZliW/UOtTIamZlSPzEd8nD2Xzt044MpIiZuS3jbwhCgxRmPac6QWwvkRaI8fOhnixB0wRfgnYifuaUd+D65IAdqDjyyfLHlXZO4bVTMaU2sqwn+k590ZTpSDlhxMSJ9fYLKb0eW/YromHt0PEXHfq7fNjmRY222pgXAFwfnTC9iCOIgAOWrgjud9iNxi1SzG9LyDxcFp+wwE0BhOWxaZOu6/42qmc+gVVqZZL+aoWFBzDlfOzMTiTgdk2NOdciSVLlSfNYvfRpaR4VZI3cXrpFJfUM85S/xI4bqTwDlDuw/iMMM/dC/WwBoH5/mVQB2VomnIovAZrbQoEHksIHVRbkkZkEtpl36OXW6YI/Un3fY/vPgE0p74zNKDXPFmHxGWHrptvA77vLgi33x6enCC0zPhvj8nQUfuzgYCLXkoSWK5AQWihPQrdkPJehU0pItuTxRyxtRBv56c0r2hTAo2NtJGiv7NOYIaaie5qKOPsTdv3ezVpD77mD9j496FOtOgWKDe1iifAVq8J32YraEyPatxKGXSWU3nX/4MWZbW+Iskl3sNLBYawDUQRph1XPwZvY4BnvDJyGLYhhNk9oK6ahg7h2PDqHs9uR30v2+bBCimNxbIISsnld6Dzwot0zK9WNz1yl/bwzQar8j/oENwAAoD32pXsdvFxe17epTlvZSWnOGIJ0LjDehmckZcI0ovO8Y8ar55ec10uDl/VPHScMMl6/h3mQQyI7gWSD0Md778XRggO52AcR3aBhvK0R6z6Jat/g+DUdcAtiWLKa0kwG+5wRdar8hKClX34IDwZSBPNSvGASOuXWTbde/AMfJKlaWwz8HSr/aRDC0pn7GWGwj3+FhMNHWKXnvwcVkrSheBz/1pNdgpHY4BW2e2jd+x37zX01W60xItmFDcFvYljZr0Wx5H5zQkAAlPf2JPviHA1bop7y0V0S317Mfkz6vQgy7y5Kr7sGFsp2f3PqkJ3dDnjh85OZqFjFS8afF6jmufE1No5wdh2aA7JAMhQ6AbLTFOTyJugZUKCkNC0mGGikGKDZWRvJ9pxquL3yGql7bk2KMyoPuZk6REoZgPyYqgiQXw6NkjbvhuI6ONrlo50xNhz1lDrfed+8cPl+r3xFDlrQ1XK8kCdQtfSREOPmD+niZXWdFZ8zHJNo3LauuZLi1jaweVIaZ/yPkowAACCIkp6kWd/JU5NsUk1WUOiHwByCENyKbIskN7R6H/VNVRKhOdy0SpF8VMICaQRDJ5JymE8JItzHbFThuRZAvwmA+rKHGCfsu0p7YQc1ByZ3YAzacScgf+2/JMTul4SsYpWFVsPewNz7Bw+ZlhwtsbIHe3rfhFu2Axy6tnzpXairzBWqP2lGwV65AAIbtoM9wCujyqYsU1dfNNXkMWfAylRjZUCwGYbJ24udrCB7hx+ZD+h8qMgr+aQ6KOGFlJGVKm5berFnFAZKwJbqkohUxvOHkDFqo1YwCTCCrsB32TLr+uf6RaeJHkc/Dl6EkQABhz1Xcx+aGBNYHvS4KAAAAAA==';
  box.innerHTML=(forms[state.cover]||forms.both).map(([id,name])=>
    `<button type="button" class="form-card" data-shape="${name}">
      <div class="mini mini-${id}">${id==="triangle"||id==="bandana"?'<img class="shape-scarf-img" src="'+triangleArt+'" alt="">':""}</div><strong>${name}</strong>
      <small>${name==="לונג"||name==="משולש"?"כיסוי מלא":"חצי כיסוי"}</small>
    </button>`
  ).join("");
}

const colors={
  base:[["טבע","#8b7359"],["מרווה","#71806a"],["ים","#557889"],["תכלת","#8bb8c3"],["ורוד","#c48e93"],["שמנת","#e6dccb"],["שחור","#282624"],["אפור","#99958e"]],
  print:[
    ["חול פרחוני","print_botanical"],
    ["ים מודפס","print_waves"],
    ["וינטג׳","print_vintage"],
    ["טרופי","print_tropical"],
    ["פרחים עדינים","print_softflowers"],
    ["גאומטרי","print_geo"],
    ["עלים","print_leaves"],
    ["אבסטרקט","print_abstract"]
  ],
  lace:[
    ["תחרה שמנת","lace_cream"],
    ["תחרה שחורה","lace_black"],
    ["תחרה ורודה","lace_pink"],
    ["תחרה טבעית","lace_natural"]
  ]
};

const textileSvgs={
 botanical:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#b99565"/><g fill="none" stroke="#65724f" stroke-width="4"><path d="M10 90Q25 55 45 15M35 100Q55 55 85 20M55 100Q70 65 98 45"/></g><g fill="#f4d8a9"><circle cx="18" cy="25" r="8"/><circle cx="72" cy="72" r="9"/><circle cx="42" cy="45" r="7"/></g><g fill="#9b4f4f"><circle cx="18" cy="25" r="3"/><circle cx="72" cy="72" r="3"/><circle cx="42" cy="45" r="3"/></g></svg>'),
 waves:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#477987"/><g fill="none" stroke="#d9ebe4" stroke-width="7"><path d="M-10 15Q15 0 40 15T90 15T140 15"/><path d="M-10 40Q15 25 40 40T90 40T140 40"/><path d="M-10 65Q15 50 40 65T90 65T140 65"/><path d="M-10 90Q15 75 40 90T90 90T140 90"/></g></svg>'),
 floral:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#b86f72"/><g fill="#f7d5c0"><circle cx="20" cy="25" r="10"/><circle cx="35" cy="18" r="10"/><circle cx="29" cy="35" r="10"/><circle cx="76" cy="72" r="11"/><circle cx="91" cy="65" r="10"/><circle cx="84" cy="82" r="10"/></g><g fill="#e39a70"><circle cx="28" cy="27" r="4"/><circle cx="84" cy="73" r="4"/></g></svg>'),
 tropical:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#718765"/><g fill="#ead49a"><ellipse cx="22" cy="25" rx="22" ry="8" transform="rotate(-35 22 25)"/><ellipse cx="72" cy="20" rx="24" ry="8" transform="rotate(-25 72 20)"/><ellipse cx="40" cy="72" rx="25" ry="8" transform="rotate(-45 40 72)"/></g><g stroke="#d9c58d" stroke-width="4"><path d="M5 95Q35 55 72 5M25 100Q50 60 98 38"/></g></svg>'),
  softflowers:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#d5a9a2"/><g fill="#f7e4d2"><circle cx="20" cy="25" r="10"/><circle cx="32" cy="16" r="10"/><circle cx="30" cy="31" r="10"/><circle cx="78" cy="72" r="11"/><circle cx="91" cy="64" r="10"/><circle cx="87" cy="82" r="10"/></g><g fill="#9d6b62"><circle cx="28" cy="24" r="4"/><circle cx="85" cy="72" r="4"/></g></svg>'),
  geo:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#7d8f98"/><path d="M0 0L25 25L50 0L75 25L100 0M0 50L25 75L50 50L75 75L100 50M0 100L25 75L50 100L75 75L100 100" fill="none" stroke="#e7d7b8" stroke-width="8"/><circle cx="25" cy="25" r="5" fill="#b66f70"/><circle cx="75" cy="75" r="5" fill="#b66f70"/></svg>'),
  leaves:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#8a9670"/><g fill="#d8c48e"><ellipse cx="20" cy="25" rx="20" ry="7" transform="rotate(35 20 25)"/><ellipse cx="70" cy="20" rx="22" ry="7" transform="rotate(-35 70 20)"/><ellipse cx="45" cy="70" rx="24" ry="8" transform="rotate(25 45 70)"/></g><g stroke="#53624d" stroke-width="3"><path d="M0 90Q35 55 85 10M15 100Q45 65 100 50"/></g></svg>'),
  abstract:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#b97872"/><circle cx="25" cy="30" r="22" fill="#e5b27f"/><circle cx="75" cy="65" r="28" fill="#657d76"/><path d="M0 80Q30 55 55 80T110 70" fill="none" stroke="#f1dcc2" stroke-width="9"/><circle cx="70" cy="20" r="9" fill="#d8c58f"/></svg>'),
 laceCream:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#ded3c0"/><g fill="none" stroke="#b9a992" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>'),
 laceBlack:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#302d2b"/><g fill="none" stroke="#9b8c7b" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>'),
 lacePink:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#c7a0a0"/><g fill="none" stroke="#a77b7d" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>'),
 laceNatural:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#aa9476"/><g fill="none" stroke="#806e5c" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>')
};

function renderSwatches(){
  const printKeys={
    print_botanical:"botanical",
    print_waves:"waves",
    print_vintage:"floral",
    print_tropical:"tropical",
    print_softflowers:"softflowers",
    print_geo:"geo",
    print_leaves:"leaves",
    print_abstract:"abstract"
  };
  const laceKeys={
    lace_cream:"laceCream",
    lace_black:"laceBlack",
    lace_pink:"lacePink",
    lace_natural:"laceNatural"
  };
  Object.entries(colors).forEach(([group,arr])=>{
    const box=$("#"+(group==="base"?"baseSwatches":group==="print"?"printSwatches":"laceSwatches"));
    if(!box)return;
    box.innerHTML=arr.map(([name,key])=>{
      if(group==="base"){
        return '<button type="button" class="swatch" title="'+name+'" data-group="'+group+'" data-name="'+name+'"><span style="display:block;width:100%;height:100%;border-radius:50%;background:'+key+'"></span></button>';
      }
      const src=group==="print" ? textileSvgs[printKeys[key]] : textileSvgs[laceKeys[key]];
      return '<button type="button" class="swatch" title="'+name+'" data-group="'+group+'" data-name="'+name+'"><img src="'+src+'" alt="'+name+'" style="display:block!important;width:100%!important;height:100%!important;border-radius:50%;object-fit:cover;opacity:1!important"></button>';
    }).join("");
  });
}
function updatePrice(){
  if($("#price"))$("#price").textContent=state.price;
}

function updateNote(){
  const n=state.fabrics.length;
  if(!$("#designNote"))return;
  $("#designNote").textContent=n<=1
    ?"בחירה נקייה ופשוטה. אם תרצי יותר עומק, אפשר להוסיף בד תומך קטן."
    :n===2
      ?"שני בדים מאפשרים ליצור היררכיה ברורה: אחד מוביל ואחד תומך."
      :"שלושה בדים יוצרים מראה עשיר יותר. כדאי לתת לאחד מהם להיות הצבע המוביל.";
}

function chooseCover(value){
  state.cover=value;
  renderForms();
  show("forms");
}

function renderPatterns(){
  const box=document.querySelector("#pattern .pattern-grid");
  if(!box)return;
  box.classList.toggle("single-option",state.shape==="קשת");
  const isTriangle=state.shape==="משולש";
  const isBandana=state.shape==="בנדנה";
  if(isTriangle || isBandana){
    const sizeClass=isBandana?" bandana-pattern":"";
    box.innerHTML=`<button class="pattern-card" data-pattern="single"><div class="pattern-visual triangle-pattern${sizeClass} pattern-1"></div><strong>תבנית 1 — בד אחד</strong><span>ריבוע שלם מבד אחד.</span></button>
       <button class="pattern-card" data-pattern="a"><div class="pattern-visual triangle-pattern${sizeClass} pattern-2"></div><strong>תבנית 2 — שני בדים</strong><span>בד מרכזי עם מסגרת חיצונית מבד שני.</span></button>
       <button class="pattern-card" data-pattern="b"><div class="pattern-visual triangle-pattern${sizeClass} pattern-3"></div><strong>תבנית 3 — שלושה בדים</strong><span>שני משולשים שווים ומסגרת חיצונית דקה מבד שלישי.</span></button>`;
    return;
  }
  if(state.shape==="קשת"){
    box.innerHTML=`<button class="pattern-card" data-pattern="single"><div class="pattern-visual bow-pattern"></div><strong>קשת חלקה</strong><span>בד אחד, ללא חלוקה.</span></button>`;
    return;
  }
  const isRibbon=state.shape==="סרט";
  const longSizeClass=isRibbon?" ribbon-pattern":"";
  box.innerHTML=`<button class="pattern-card" data-pattern="single"><div class="pattern-visual long-pattern${longSizeClass} pattern-1"></div><strong>תבנית 1 — מלבן פשוט</strong><span>מלבן אחד, בד אחד.</span></button>
       <button class="pattern-card" data-pattern="a"><div class="pattern-visual long-pattern${longSizeClass} pattern-2"></div><strong>תבנית 2 — חלוקה אופקית</strong><span>חלק עליון בד אחד, חלק תחתון בד שני.</span></button>
       <button class="pattern-card" data-pattern="b"><div class="pattern-visual long-pattern${longSizeClass} pattern-3"></div><strong>תבנית 3 — חלוקה משולבת</strong><span>החלק העליון בד אחד, והתחתון מתחלק 50/50 לשני בדים.</span></button>`;
}

function choosePattern(value){
  state.pattern=value;
  state.fabrics=[];
  state.price=109;
  show("fabrics");
  updatePrice();
  renderLivePreview();
}

function fabricVisual(item){
  if(!item)return "";
  const parts=item.split(":");
  const group=parts[0], name=parts.slice(1).join(":");
  if(group==="base"){const found=colors.base.find(x=>x[0]===name);return found?found[1]:"";}
  const arr=group==="print"?colors.print:colors.lace;
  const found=arr.find(x=>x[0]===name);
  if(!found)return "";
  const map={print_botanical:"botanical",print_waves:"waves",print_vintage:"floral",print_tropical:"tropical",print_softflowers:"softflowers",print_geo:"geo",print_leaves:"leaves",print_abstract:"abstract",lace_cream:"laceCream",lace_black:"laceBlack",lace_pink:"lacePink",lace_natural:"laceNatural"};
  return textileSvgs[map[found[1]]]||"";
}
function previewSlots(){return state.pattern==="single"?1:state.pattern==="a"?2:3;}
function renderLivePreview(){
  const box=$("#livePreview");if(!box)return;
  const count=previewSlots();
  const cls=(state.shape==="משולש"||state.shape==="בנדנה")?"live-square":state.shape==="קשת"?"live-bow":state.shape==="סרט"?"live-ribbon":"live-long";
  box.className="live-preview "+cls+" slots-"+count;
  box.innerHTML=Array.from({length:count},(_,i)=>{const fill=fabricVisual(state.fabrics[i]);const style=fill?(fill.startsWith("#")?"background:"+fill:"background-image:url(\'"+fill+"\');background-size:cover;background-position:center"):"";return '<div class="live-part part-'+(i+1)+'" style="'+style+'"><span>'+(fill?"":"בד "+(i+1))+'</span></div>';}).join("");
}

function chooseFinish(button){
  state.finish=button.dataset.finish==="none"?"נקי":
    button.dataset.finish==="tiara"?"נזר בד":
    button.dataset.finish==="fringe"?"פרנזים":"שרשרת";
  state.price=basePrice()+(state.fabrics.length>=2?45:0)+(state.fabrics.length>=3?35:0)+(+button.dataset.add||0);
  $("#finalPrice").textContent=state.price;
  $("#summaryShape").textContent=state.shape;
  $("#summaryPattern").textContent=state.pattern==="single"?"בד ראשוני בלבד":state.pattern==="a"?"תבנית א׳":"תבנית ב׳";
  $("#summaryFinish").textContent=state.finish;
  const live=$("#livePreview"), final=$("#finalScarf");
  if(live&&final){final.className=live.className;final.innerHTML=live.innerHTML;}
  show("result");
}

document.addEventListener("click",event=>{
  const restart=event.target.closest("[data-restart-design]");
  if(restart){event.preventDefault();restartDesign();return;}

  const back=event.target.closest("[data-back]");
  if(back){event.preventDefault();goBack();return;}

  const go=event.target.closest("[data-go]");
  if(go){event.preventDefault();show(go.dataset.go);return;}

  const cover=event.target.closest("[data-cover]");
  if(cover){chooseCover(cover.dataset.cover);return;}

  const form=event.target.closest(".form-card");
  if(form){state.shape=form.dataset.shape;renderPatterns();show("pattern");return;}

  const pattern=event.target.closest("[data-pattern]");
  if(pattern){choosePattern(pattern.dataset.pattern);return;}

  const swatch=event.target.closest(".swatch");
  if(swatch){
    swatch.classList.toggle("selected");
    const item=swatch.dataset.group+":"+swatch.dataset.name;
    if(swatch.classList.contains("selected"))state.fabrics.push(item);
    else state.fabrics=state.fabrics.filter(x=>x!==item);
    state.price=basePrice()+(state.fabrics.length>=2?45:0)+(state.fabrics.length>=3?35:0);
    updatePrice();updateNote();renderLivePreview();return;
  }

  const finish=event.target.closest(".finish-card");
  if(finish){chooseFinish(finish);return;}

  const mood=event.target.closest(".mood");
  if(mood){show("choose");return;}

  const rating=event.target.closest(".rating button");
  if(rating){$$(".rating button").forEach(x=>x.classList.remove("active"));rating.classList.add("active");return;}

  const yesno=event.target.closest(".yesno button");
  if(yesno){$$(".yesno button").forEach(x=>x.classList.remove("active"));yesno.classList.add("active");return;}

  if(event.target.closest("#thanks")){    event.preventDefault();    const rating=$(".rating button.active")?.textContent?.trim()||"לא נבחר";    const favorite=document.getElementById("feedbackFavorite")?.value?.trim()||"לא נכתב";    const improvement=document.getElementById("feedbackImprovement")?.value?.trim()||"לא נכתב";    const interest=$("#feedback .yesno button.active")?.textContent?.trim()||"לא נבחר";    const name=document.getElementById("feedbackName")?.value?.trim()||"לא נכתב";    const contact=document.getElementById("feedbackContact")?.value?.trim()||"לא נכתב";    const message=["משוב חדש — עיצוב אישי","","⭐ דירוג: "+rating+"/5","","מה הכי אהבת בתהליך?",favorite,"","הערות לשיפור השירות או החוויה:",improvement,"","האם היית רוצה לעצב מטפחת כזו באמת?",interest,"","שם:",name,"","טלפון / אימייל:",contact].join("\n");    window.location.href="https://wa.me/972506334993?text="+encodeURIComponent(message);    return;  }  if(event.target.closest("#restart"))location.reload();
});

renderSwatches();
updatePrice();
$$(".screen").forEach(screen=>{screen.hidden=!screen.classList.contains("active");});
updateProgress();