// pm2 start ecosystem.config.js --env production
// pm2 stop ecosystem.config.js
// pm2 delete ecosystem.config.js
// pm2 reload ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'NamthPlayGround SERVER', // 애플리케이션 이름
      script: './dist/main.js', // PM2를 실행시켜줄 스크립트 파일의 경로
      instances: 2, // 설치될 앱 인스턴스가 갯수
      autorestart: true, // 앱 크러쉬 등으로 인해 앱이 종료될 때 재시작할지 여부 (default: true)
      watch: false, // 폴더 내의 파일에 변경이 있을때, 앱이 리로딩 여부
      wait_ready: true,
      listen_timeout: 50000, // time in ms before forcing a reload if app not listening
      kill_timeout: 5000, // time in milliseconds before sending a final SIGKILL
      max_memory_restart: '200M',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      out_file: 'logs/out.log',
    },
  ],
};
