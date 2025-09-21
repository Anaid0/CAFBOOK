import cron from "node-cron";
import { AppDataSource } from "../config/con_data_bases";
import { PostsEntity } from "../entities/PostsEntity";
import { LessThan } from "typeorm";

export function initPostsPurgeJob() {
  const postsRepository = AppDataSource.getRepository(PostsEntity);

  cron.schedule("0 0 * * *", async () => {
    console.log("[CRON] Ejecutando limpieza de posts...");

    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 10);

    const postsToDelete = await postsRepository.find({
      where: {
        status: 0,
        deleted_at: LessThan(limitDate),
      },
    });

    if (postsToDelete.length > 0) {
      await postsRepository.remove(postsToDelete);
      console.log(`[CRON] Se eliminaron ${postsToDelete.length} posts.`);
    } else {
      console.log("[CRON] No hay posts para eliminar.");
    }
  });
}
