import { QueryRunner } from "typeorm";

export async function migratePaymentMethods(queryRunner: QueryRunner) {
  const paymentMethods = await q(
    queryRunner,
    {
      mysql: "SELECT `id`, `code`, `configArgs` from `payment_method`",
      postgres: 'SELECT "id", "code", "configArgs" from "payment_method"',
    },
    []
  );
  for (const method of paymentMethods) {
    const handler = JSON.stringify({
      code: method.code,
      args: JSON.parse(method.configArgs),
    });
    const result = await q(
      queryRunner,
      {
        mysql:
          "UPDATE `payment_method` SET `handler` =  ?, `name` = ? WHERE `id` = ?",
        postgres:
          'UPDATE "payment_method" SET "handler" =  $1, "name" = $2 WHERE "id" = $3',
      },
      [handler, method.code, method.id]
    );
    const a = result;
  }
}

export async function addToDefaultChannel(
  queryRunner: QueryRunner,
  tableName: string,
  idName: string
) {
  const channelTableName = `${tableName}_channels_channel`;
  const result = await q(
    queryRunner,
    {
      mysql:
        "INSERT INTO `" +
        channelTableName +
        "` (" +
        idName +
        ", channelId) SELECT id, (SELECT id from `channel` WHERE `code` = '__default_channel__') FROM `" +
        tableName +
        "`",
      postgres:
        'INSERT INTO "' +
        channelTableName +
        '" ("' +
        idName +
        '", "channelId") SELECT "id", (SELECT "id" from "channel" WHERE "code" = \'__default_channel__\') FROM "' +
        tableName +
        '"',
    },
    []
  );
  const a = result;
}

function q(
  queryRunner: QueryRunner,
  query: { mysql: string; postgres: string },
  params: any[] = []
) {
  return queryRunner.query(
    isPostgres(queryRunner) ? query.postgres : query.mysql,
    params
  );
}

function isPostgres(queryRunner: QueryRunner): boolean {
  const { type } = queryRunner.connection.options;
  return (
    type === "postgres" ||
    type === "aurora-data-api-pg" ||
    type === "cockroachdb"
  );
}
