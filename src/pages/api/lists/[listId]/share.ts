import {createRoute} from "../../../../app/utils/api/route";
import {shareListUsecaseFactory} from "../../../../core/use-cases/shareList";
import {authorized, listRepository} from "../../../../app/dependencies";
import {normalizeQueryParam} from "../../../../app/utils/normalizeQueryParam";


export default createRoute().get(async (req,res) => {
    const {
        query: { listId: listIdQuery },
    } = req;
    const listId = normalizeQueryParam(listIdQuery);
    const shareList = shareListUsecaseFactory({listRepository})
    await shareList({ listId, currentUserId: '233232' });

    res.json({
        success: true
    })
    }
)
