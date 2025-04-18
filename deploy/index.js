import scpClient from 'scp2'; // 自动化部署
import chalk from 'chalk'; // 控制台输出的语句
import ora from 'ora';

const spinner = ora('月光网游选号网正在自动部署...');

const server = {
  host: '47.96.168.185', // 服务器的IP地址
  port: 22, // 服务器端口， 一般为 22
  username: 'root', // 用户名
  password: 'XHW123456.', // 密码
  path: '/Moonlight-H5', // 项目部署的服务器目标位置
}

spinner.start();

// 本地打包文件的位置 ./dist
scpClient.scp('./dist', server, (err) => {
  spinner.stop();
  if (!err) {
    console.log(chalk.blue('月光网游选号网自动化部署完毕!'));
  } else {
    console.log(chalk.red('月光网游选号网自动化部署出现异常'), err);
  }
});