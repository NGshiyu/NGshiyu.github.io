// // 鼠标焦点粒子动效
// class MouseParticleEffect {
//   constructor() {
//     this.canvas = document.createElement('canvas');
//     this.ctx = this.canvas.getContext('2d');
//     this.particles = [];
//     this.mouseX = 0;
//     this.mouseY = 0;
//     this.init();
//   }
//
//   init() {
//     // 设置canvas样式
//     this.canvas.style.position = 'fixed';
//     this.canvas.style.top = '0';
//     this.canvas.style.left = '0';
//     this.canvas.style.width = '100%';
//     this.canvas.style.height = '100%';
//     this.canvas.style.pointerEvents = 'none';
//     this.canvas.style.zIndex = '-1';
//     this.canvas.style.opacity = '0.6';
//
//     // 设置canvas尺寸
//     this.resize();
//     window.addEventListener('resize', () => this.resize());
//
//     // 添加到页面
//     document.body.appendChild(this.canvas);
//
//     // 监听鼠标移动
//     document.addEventListener('mousemove', (e) => {
//       this.mouseX = e.clientX;
//       this.mouseY = e.clientY;
//       this.createParticle(e.clientX, e.clientY);
//     });
//
//     // 开始动画
//     this.animate();
//   }
//
//   resize() {
//     this.canvas.width = window.innerWidth;
//     this.canvas.height = window.innerHeight;
//   }
//
//   createParticle(x, y) {
//     // 创建多个粒子形成爆发效果
//     for (let i = 0; i < 3; i++) {
//       this.particles.push({
//         x: x,
//         y: y,
//         vx: (Math.random() - 0.5) * 2,
//         vy: (Math.random() - 0.5) * 2,
//         size: Math.random() * 3 + 1,
//         life: 1.0,
//         decay: Math.random() * 0.01 + 0.005,
//         color: this.getRandomColor()
//       });
//     }
//
//     // 限制粒子数量
//     if (this.particles.length > 100) {
//       this.particles = this.particles.slice(-100);
//     }
//   }
//
//   getRandomColor() {
//     const colors = [
//       'rgba(52, 152, 219, ',  // 蓝色
//       'rgba(155, 89, 182, ',  // 紫色
//       'rgba(46, 204, 113, ',  // 绿色
//       'rgba(241, 196, 15, ',  // 黄色
//       'rgba(231, 76, 60, ',   // 红色
//       'rgba(230, 126, 34, '   // 橙色
//     ];
//     return colors[Math.floor(Math.random() * colors.length)];
//   }
//
//   updateParticles() {
//     for (let i = this.particles.length - 1; i >= 0; i--) {
//       const p = this.particles[i];
//
//       // 更新位置
//       p.x += p.vx;
//       p.y += p.vy;
//
//       // 添加重力效果
//       p.vy += 0.05;
//
//       // 减少生命值
//       p.life -= p.decay;
//
//       // 移除死亡粒子
//       if (p.life <= 0) {
//         this.particles.splice(i, 1);
//       }
//     }
//   }
//
//   drawParticles() {
//     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//
//     for (const p of this.particles) {
//       this.ctx.beginPath();
//       this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
//       this.ctx.fillStyle = p.color + p.life + ')';
//       this.ctx.fill();
//
//       // 添加发光效果
//       this.ctx.shadowBlur = 10;
//       this.ctx.shadowColor = p.color + (p.life * 0.5) + ')';
//     }
//
//     this.ctx.shadowBlur = 0;
//   }
//
//   animate() {
//     this.updateParticles();
//     this.drawParticles();
//     requestAnimationFrame(() => this.animate());
//   }
// }
//
// // 页面加载完成后初始化
// document.addEventListener('DOMContentLoaded', () => {
//   new MouseParticleEffect();
// });