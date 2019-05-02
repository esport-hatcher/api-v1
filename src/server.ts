import 'module-alias/register';
import app from '@app';
import sequelize from '@utils/database';

sequelize(false).then(() => {
  app.listen(process.env.PORT_API, () => {
    console.log(`Executing server in ${process.env.NODE_ENV} mode`);
    console.log(`Server listening on ${process.env.PORT_API}`);
  });
});
